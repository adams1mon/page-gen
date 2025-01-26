import { useEffect, useRef } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { useSiteStore } from "@/lib/store/site-store";
import { useRClickedComponent } from "./hooks/useRClickComponent";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { EditorContextMenu } from "./components/EditorContextMenu";
import { ComponentTreeEvent, EventDispatcher, EventType } from "@/lib/core/EventDispatcher";
import { useComponentSelector } from "@/lib/store/component-selector-store";
import { Page } from "@/lib/core/page/Page";


interface ShadowEditorProps {
    onChange: () => void;
}

export function ShadowEditor({ onChange }: ShadowEditorProps) {

    const ref = useRef(null);
    const { site } = useSiteStore();
    const { rClickedComponent, rClickComponent } = useRClickedComponent();
    const { openComponentSelector } = useComponentSelector();

    useEffect(() => {

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;

        shadow.appendChild(site.htmlRoot);

        const handleContextMenu = (e: MouseEvent) => {
            // find nearest ancestor element of the clicked element 
            // with a 'data-id' attribute, and select it

            const target = e.target as HTMLElement;
            if (!target) return;

            const componentRoot = target.closest('[data-id]') as HTMLElement | null;
            if (!componentRoot || componentRoot.dataset.id?.startsWith('Site')) return;

            // Every element in the generated page MUST have a data-id attribute.
            const id = componentRoot.dataset.id!;

            const component = site.findChildById(id);
            if (!component) {
                console.warn("no component for id in site", id);
                return;
            }

            rClickComponent(component);
        };

        EventDispatcher.addHandler(
            EventType.COMPONENT_ADDED,
            ({ parent, component, position }: ComponentTreeEvent) => {
                component.htmlElement.dataset.id = component.id;

                addWrapperOverlay(component, position);

                removeEmptyContainerPlaceholder(parent);
                addEmptyContainerPlaceholder(component, openComponentSelector);
            },
        );

        EventDispatcher.addHandler(
            EventType.COMPONENT_LOADED,
            ({ component }: ComponentTreeEvent) => {
                component.htmlElement.dataset.id = component.id;

                addWrapperOverlay(component);
                addEmptyContainerPlaceholder(component, openComponentSelector);
            },
        );

        EventDispatcher.addHandler(
            EventType.COMPONENT_UPDATED,
            ({ component }: ComponentTreeEvent) => {

                component.htmlElement.dataset.id = component.id;
            },
        );

        EventDispatcher.addHandler(
            EventType.COMPONENT_REMOVED,
            ({ parent, component }: ComponentTreeEvent) => {

                // See if the placeholder needs to be added back to the parent container element.
                // Don't let the Page to show the placeholder,
                // only show it for components.
                if (parent.type === "Page") return;
                addEmptyContainerPlaceholder(parent as ComponentNode<any>, openComponentSelector);

                removeWrapperOverlay(component);
            },
        );

        shadow.addEventListener('contextmenu', handleContextMenu);

        return () => {
            shadow.removeEventListener('contextmenu', handleContextMenu);
        };

    }, [ref.current]);

    const handleRemove = (comp: ComponentNode<any>) => {
        comp.remove()
        onChange();
    };

    const handleSiblingInsert = (
        reference: ComponentNode<any> | null,
        newComponent: ComponentNode<any>,
        position: 'before' | 'after',
    ) => {
        console.log("sibling insert", position, reference, newComponent);
        if (!reference) return;
        reference.addSibling(newComponent, position);
        onChange();
    };

    const handleInsertInto = (parent: ComponentNode<any>, newComponent: ComponentNode<any>) => {
        parent.addChild(newComponent);
        console.log("add comp", newComponent);
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
                onInsertInto={handleInsertInto}
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

function createWrapperId(node: ComponentNode<any>): string {
    return "wrapper-" + node.id;
}

function addWrapperOverlay(node: ComponentNode<any>, position?: "before" | "after") {
    const wrapperId = createWrapperId(node);

    if (node.htmlElement.parentElement?.matches(wrapperId)) {
        console.log("wrapper already present, node", node);
        return;
    }

    // add an overlay wrapper div, maybe could also contain the container empty placeholder?
    const wrapperDiv = document.createElement("div");
    wrapperDiv.dataset.wrapperId = wrapperId;
    wrapperDiv.style.position = "relative";

    // add a floating tab in the top left with the name of the component
    const nameTab = document.createElement("div");
    nameTab.innerText = node.componentName;
    nameTab.style.position = "fixed";
    nameTab.style.position = "absolute";
    nameTab.style.top = "0";
    nameTab.style.left = "0";
    nameTab.style.backgroundColor = "white";
    nameTab.style.color = "black";
    nameTab.style.zIndex = "999";
    nameTab.style.padding = "0 0.2rem";
    nameTab.style.borderBottomRightRadius = "0.3rem";
    nameTab.style.opacity = "0.5";
    nameTab.style.display = "none";

    wrapperDiv.appendChild(nameTab);

    wrapperDiv.onmouseenter = () => {
        wrapperDiv.style.outline = "2px dashed hsl(0, 0%, 20%)";
        wrapperDiv.style.backgroundColor = "hsl(0, 0%, 80%, 0.3)";
        nameTab.style.display = "block";
    }

    wrapperDiv.onmouseleave = () => {
        wrapperDiv.style.outline = "";
        wrapperDiv.style.backgroundColor = "";
        nameTab.style.display = "none";
    }

    // Handle insert positions.
    if (position === "before") {

        // The node's html element got inserted before another html element in the tree,
        // but it's inside the wrapper of that element, because the insertion doesn't know about
        // the wrappers installed by the editor.
        // We need to move the wrapper outside of the reference element's wrapper.
        node.htmlElement.parentElement?.insertAdjacentElement("beforebegin", wrapperDiv);

    } else if (position === "after") {
        // Same thing, but after.
        node.htmlElement.parentElement?.insertAdjacentElement("afterend", wrapperDiv);
    } else {
        // Simple insert.
        node.htmlElement.parentElement?.appendChild(wrapperDiv);
    }

    node.htmlElement.parentElement?.removeChild(node.htmlElement);

        //node.htmlElement.parentElement?.appendChild(wrapperDiv);
        //node.htmlElement.parentElement?.removeChild(node.htmlElement);

    wrapperDiv.appendChild(node.htmlElement);
}

function removeWrapperOverlay(node: ComponentNode<any>) {
   const wrapperId = createWrapperId(node); 

   const wrapperDiv = node.htmlElement.closest(`[data-wrapper-id="${wrapperId}"]`);
   if (!wrapperDiv) return;

   wrapperDiv.remove();
}

function addEmptyContainerPlaceholder(
    node: ComponentNode<any>,
    openComponentSelector: (onInsert: (comp: ComponentNode<any>) => void) => void,
) {
    // only add a placeholder if there are no children
    if (!node.children || node.children.length > 0) return;

    // TODO: maybe add an 'add' button if there are children?
    function addChild(e: Event) {
        e.stopPropagation();

        // open the component selector modal
        openComponentSelector((comp) => node.addChild(comp));
        console.log("clicked", node);
    }

    const placeholder = createPlaceholder(node.componentName, addChild);
    placeholder.dataset.editorPlaceholder = node.id;

    const wrapperId = "wrapper-" + node.id;
    const wrapperDiv = node.htmlElement.closest(`[data-wrapper-id="${wrapperId}"]`);
    if (!wrapperDiv) {
        console.log("no wrapper div found", node);
        return;
    }

    // placeholder already present
    const placeholderAttr = "[data-editor-placeholder]";
    if (wrapperDiv.querySelector(placeholderAttr)) return;

    wrapperDiv.appendChild(placeholder);
}

function removeEmptyContainerPlaceholder(node: ComponentNode<any> | Page) {
    if (!node.children || node.children.length === 0) return;
    node.htmlElement.parentElement?.querySelector(`[data-editor-placeholder="${node.id}"]`)?.remove();
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
        color: hsl(0, 0%, 45.1%); /* Grey */
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

    // button hover styles
    const style = document.createElement("style");
    style.innerHTML = `
        button:hover { 
            cursor: pointer;
            background-color: hsl(0, 0%, 90%); /* Grey */
        }
    `;

    // Add click event listener
    button.addEventListener('click', (e) => onClick(e));

    // Append elements to inner div
    innerDiv.appendChild(title);
    innerDiv.appendChild(explanation);
    innerDiv.appendChild(button);
    placeholder.appendChild(style);
    placeholder.appendChild(innerDiv);

    return placeholder;
}

