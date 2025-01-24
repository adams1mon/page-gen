import { MouseEventHandler, useEffect, useRef } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { useSiteStore } from "@/lib/store/site-store";
import { useRClickedComponent } from "./hooks/useRClickComponent";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { EditorContextMenu } from "./components/EditorContextMenu";
import { EventDispatcher, EventType } from "@/lib/core/EventDispatcher";
import { useComponentSelector } from "@/lib/store/component-selector-store";
import { Page } from "@/lib/core/page/Page";


interface ShadowEditorProps {
    onChange: () => void;
}

export function ShadowEditor({ onChange }: ShadowEditorProps) {

    const ref = useRef(null);
    const { site } = useSiteStore();
    const { rClickedComponent, rClickComponent } = useRClickedComponent();
    const { open, onInsert } = useComponentSelector();

    useEffect(() => {

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;

        console.log(site);
        
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
                //e.preventDefault();
            }
        };

        function addHoverOutline(node: ComponentNode<any>) {
            // Add hover outline
            let outline = "";
            let bgColor = "";
            node.htmlElement.onmouseenter = (e) => {
                outline = node.htmlElement.style.outline;
                bgColor = node.htmlElement.style.backgroundColor;
                node.htmlElement.style.outline = "2px solid blue";
                node.htmlElement.style.backgroundColor = "hsl(0, 0%, 80%, 0.3)";
                e.stopPropagation();
            };
            node.htmlElement.onmouseleave = () => {
                node.htmlElement.style.outline = outline;
                node.htmlElement.style.backgroundColor = bgColor;
            };
        }

        function addEmptyContainerPlaceholder(node: ComponentNode<any>) {
            // add a placeholder if the child is a container component
            // handle the child being a container component
            if (!node.comp.acceptsChildren || !node.children) return;

            const placeholderAttr = "[data-editor-placeholder]";
            if (node.htmlElement.querySelector(placeholderAttr)) return;

            function addChild(e: Event) {
                e.stopPropagation();

                // open the component selector modal
                open((comp) => node.addChild(comp));
                console.log("clicked", node);
            }

            const placeholder = createPlaceholder(node.componentName, addChild);
            placeholder.dataset.editorPlaceholder = 'true';

            node.htmlElement.appendChild(placeholder);
        }

        EventDispatcher.addHandler(
            EventType.COMPONENT_ADDED,
            ({ child }: { parent: ComponentNode<any> | Page, child: ComponentNode<any> }) => {

                child.htmlElement.dataset.id = child.id;

                addHoverOutline(child);
                addEmptyContainerPlaceholder(child);
            },
        );

        //EventDispatcher.addHandler(
        //    EventType.PAGE_LOADED,
        //    ({ child }: { parent: ComponentNode<any> | Page, child: ComponentNode<any> }) => {
        //
        //        child.htmlElement.dataset.id = child.id;
        //
        //        addHoverOutline(child);
        //        addEmptyContainerPlaceholder(child);
        //    },
        //);

        shadow.addEventListener('contextmenu', handleContextMenu);

        return () => {
            shadow.removeEventListener('contextmenu', handleContextMenu);
        };

    }, [ref.current]);
    
    //useEffect(() => {
    //    if (!ref.current) return;
    //    if (!ref.current.shadowRoot) return;
    //
    //    const shadow = ref.current.shadowRoot as ShadowRoot;
    //
    //    if (shadow.firstChild) {
    //        shadow.replaceChild(site.htmlRoot, shadow.firstChild);
    //    } else {
    //        shadow.appendChild(site.htmlRoot);
    //    }
    //
    //    console.log("page changed, replaced/added html");
    //
    //}, [site]);

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

// Create a placeholder component
function createPlaceholder(componentName: string, onClick: (e: MouseEvent) => void): HTMLElement {
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        width: 100%; /* Fill entire space */
    `;

    const innerDiv = document.createElement('div');
    innerDiv.style.cssText = `
        border: 2px dashed #ccc;
        padding: 1rem;
        width: 100%; /* Fill entire space */
        height: 100%; /* Fill entire space */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    const title = document.createElement('div');
    title.innerText = componentName;
    title.style.cssText = `
        font-weight: bold;
        font-size: 1.3rem; /* Adjust font size as needed */
    `;

    const explanation = document.createElement('div');
    explanation.innerText = 'This component is empty. Click the button below to add a component.';
    explanation.style.cssText = `
        margin: 1rem 0; /* Add some margin */
    `;

    const button = document.createElement('button');
    button.innerText = 'Add Component';
    button.style.cssText = `
        padding: 0.3rem 0.5rem; /* Small padding */
        border-radius: 5px; /* Rounded borders */
        border: 2px solid #bbb;
        color: hsl(0, 0%, 45.1%); /* Grey */
        cursor: pointer;
    `;

    // Add click event listener
    button.addEventListener('click', onClick);

    // Append elements to inner div
    innerDiv.appendChild(title);
    innerDiv.appendChild(explanation);
    innerDiv.appendChild(button);
    placeholder.appendChild(innerDiv);

    return placeholder;
}

