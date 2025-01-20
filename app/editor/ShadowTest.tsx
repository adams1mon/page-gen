import { useEffect, useRef } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { useSiteStore } from "@/lib/store/site-store";
import { useRClickedComponent } from "./hooks/useRClickComponent";
import { ComponentWrapper } from "@/lib/core/ComponentWrapper";
import { EventDispatcher, EventType } from "@/lib/core/EventDispatcher";
import { ComponentContextMenu } from "./components/EditorContextMenu";


interface ShadowTestProps {
    onChange: () => void;
}

export function ShadowTest({ onChange }: ShadowTestProps) {

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


        EventDispatcher.register(
            EventType.COMPONENT_HTML_CREATED,
            ({ newHtml, id }: { newHtml: HTMLElement, id: string }) => {

                console.log("created component html", newHtml);

                newHtml.dataset.id = id;

                let outline = "";
                newHtml.onmouseenter = () => {
                    outline = newHtml.style.outline;
                    console.log("mouse enter", newHtml);
                    newHtml.style.outline = "2px solid blue";
                };

                newHtml.onmouseleave = () => {
                    console.log("mouse leave", newHtml);
                    newHtml.style.outline = outline;
                }
            },
        );

        shadow.addEventListener('contextmenu', handleContextMenu);

        return () => {
            shadow.removeEventListener('contextmenu', handleContextMenu);
        };

    }, [ref.current]);

    const handleRemove = (comp: ComponentWrapper<any>) => {
        site.removeChild(comp);
        onChange();
    };

    const handleSiblingInsert = (
        reference: ComponentWrapper<any> | null,
        newComponent: ComponentWrapper<any>,
        position: 'before' | 'after',
    ) => {
        console.log("sibling insert", position);
        if (!reference) return;
        reference.addSibling(newComponent, position);
        onChange();
    };

    const handleInsert = (newComponent: ComponentWrapper<any>) => {
        site.addChild(newComponent);
        console.log("add comp", newComponent);
        onChange();
    };

    return (
        <div className="h-full overflow-auto">
            <ComponentContextMenu
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

            </ComponentContextMenu>

            <div className="p-4">
                <ComponentDivider
                    onInsert={handleInsert}
                />
            </div>
        </div>
    );
}


