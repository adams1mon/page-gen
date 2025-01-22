import { useEffect, useRef } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { useSiteStore } from "@/lib/store/site-store";
import { useRClickedComponent } from "./hooks/useRClickComponent";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { EditorContextMenu } from "./components/EditorContextMenu";
import { EventDispatcher, EventType } from "@/lib/core/EventDispatcher";


interface ShadowEditorProps {
    onChange: () => void;
}

export function ShadowEditor({ onChange }: ShadowEditorProps) {

    const ref = useRef(null);
    const { site } = useSiteStore();
    const { rClickedComponent, rClickComponent } = useRClickedComponent();

    useEffect(() => {

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;
        shadow.appendChild(site.htmlRoot);

        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const componentRoot = target.closest('[data-id]');
            if (componentRoot && !componentRoot.dataset.id.startsWith('Site')) {

                const id = componentRoot.dataset.id;

                const component = site.findChildById(id);
                if (!component) {
                    console.warn("no component for id in site", id);
                    return;
                }

                rClickComponent(component);
            }
        };

        EventDispatcher.addHandler(
            EventType.COMPONENT_ADDED,
            ({ child }: { parent: ComponentNode<any>, child: ComponentNode<any> }) => {

                child.htmlElement.dataset.id = child.id;

                // Add hover outline
                let outline = "";
                child.htmlElement.onmouseenter = () => {
                    outline = child.htmlElement.style.outline;
                    child.htmlElement.style.outline = "2px solid blue";
                };
                child.htmlElement.onmouseleave = () => {
                    child.htmlElement.style.outline = outline;
                };
            },
        );

        EventDispatcher.addHandler(
            EventType.COMPONENT_ADDED,
            ({ child }: { parent: ComponentNode<any>, child: ComponentNode<any> }) => {

                // Handle empty containers
                if (!child.comp.acceptsChildren || !child.children) return;

                if (child.htmlElement.querySelector("[data-editor-placeholder]")) return;

                // Set container to relative positioning if not already positioned
                const computedStyle = window.getComputedStyle(child.htmlElement);
                if (computedStyle.position === 'static') {
                    child.htmlElement.style.position = 'relative';
                }

                // Create placeholder
                const placeholder = document.createElement('div');
                placeholder.dataset.editorPlaceholder = 'true';

                const addButton = document.createElement('button');
                addButton.textContent = `Add to ${child.comp.componentName}`;
                addButton.onclick = (e) => {
                    e.stopPropagation();
                    rClickComponent(child);
                    console.log("clicked", child);
                };

                placeholder.appendChild(addButton);
                child.htmlElement.appendChild(placeholder);
            },
        );

        shadow.addEventListener('contextmenu', handleContextMenu);

        return () => {
            shadow.removeEventListener('contextmenu', handleContextMenu);
        };

    }, [ref.current]);

    const handleRemove = (comp: ComponentNode<any>) => {
        site.removeChild(comp);
        onChange();
    };

    const handleSiblingInsert = (
        reference: ComponentNode<any> | null,
        newComponent: ComponentNode<any>,
        position: 'before' | 'after',
    ) => {
        console.log("sibling insert", position);
        if (!reference) return;
        reference.addSibling(newComponent, position);
        onChange();
    };

    const handleInsert = (newComponent: ComponentNode<any>) => {
        site.addChild(newComponent);
        console.log("add comp", newComponent);
        onChange();
    };

    return (
        <div className="h-full overflow-auto">
            <EditorContextMenu
                onInsert={handleInsert}
                onInsertBefore={c => {
                    handleSiblingInsert(rClickedComponent, c, 'before');
                }}
                onInsertAfter={c => {
                    handleSiblingInsert(rClickedComponent, c, 'after');
                }}
                onRemove={handleRemove}
            >

                {/* shadow host for the preview */}
                <div
                    className="m-4 border-2 border-red-500"
                    ref={ref}
                ></div>

            </EditorContextMenu>

            <div className="p-4">
                <ComponentDivider
                    onInsert={handleInsert}
                />
            </div>
        </div>
    );
}


