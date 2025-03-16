import { useEffect, useRef } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { useSiteStore } from "@/lib/store/site-store";
import { useRClickedComponent } from "./hooks/useRClickComponent";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { EditorContextMenu } from "./components/EditorContextMenu";
import { ComponentTreeEvent, EventDispatcher, EventType} from "@/lib/core/EventDispatcher";
import { useComponentSelector } from "@/lib/store/component-selector-store";
import { Page } from "@/lib/core/page/Page";


// onChange only saves the site to local stoarage tbh
interface ShadowEditorProps {
    onChange: () => void;
}

export function ShadowEditor({ onChange }: ShadowEditorProps) {

    const ref = useRef(null);
    const { site } = useSiteStore();
    const { rClickedComponent, rClickComponent } = useRClickedComponent();
    const { openComponentSelector } = useComponentSelector();

    useEffect(() => {
        console.log("site effect called", site);

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;

        if (shadow.firstChild) {
            console.log("replacing site html root", site, ref.current);
            shadow.replaceChild(site.htmlRoot, shadow.firstChild);
        } else {
            console.log("appending site html root", site, ref.current);
            shadow.appendChild(site.htmlRoot);
        }

        function wrapperContextMenuHandler(component: ComponentNode, e: Event) {
            // select the first component that has the matching data-id
            const elem = e.composedPath().find((e) => {

                // ugly haxxx
                // clicking the placeholder should also select the component

                // @ts-ignore
                if (e.dataset?.wrapperId !== undefined ||

                    // @ts-ignore
                    e.dataset?.editorPlaceholder !== undefined) {
                    return e;
                }

            }) as HTMLElement;

            if (elem?.dataset?.wrapperId === component.id || elem?.dataset?.editorPlaceholder === component.id) {
                rClickComponent(component);
            }
        }
        
        // creates and adds an overlay div to provide some editor functionality,
        // like adding an outline on hover
        function overlay(component: ComponentNode) {
            const wrapperDiv = createWrapperOverlay(component);
            wrapperDiv.addEventListener("contextmenu", (e) => wrapperContextMenuHandler(component, e));
            component.addWrapperOverlay(wrapperDiv);

            // needs the wrapper div added
            addEmptyContainerPlaceholder(component, openComponentSelector, onChange);
        }

        EventDispatcher.addHandler(
            EventType.COMPONENT_ADDED,
            ({ parent, component }: ComponentTreeEvent) => {

                component.children?.forEach(c => overlay(c));
                overlay(component);

                // remove the parent's placeholder because it now has a child added
                removeEmptyContainerPlaceholder(parent);
            },
        );

        EventDispatcher.addHandler(
            EventType.COMPONENT_LOADED,
            ({ component }) => {

                // don't need to add the overlay to the children, 
                // because a "loaded" event is fired for every component;
                // also don't need to remove any empty placeholder containers
                overlay(component);
            },
        );

        EventDispatcher.addHandler(
            EventType.COMPONENT_REMOVED,
            ({ parent }: ComponentTreeEvent) => {

                // See if the placeholder needs to be added back to the parent container element.
                // Don't let the Page show the placeholder,
                // only show it for components.
                if (parent.type === "Page") return;

                addEmptyContainerPlaceholder(parent as ComponentNode, openComponentSelector, onChange);
            },
        );

    }, [site, ref.current]);


    const handleRemove = (comp: ComponentNode) => {
        comp.remove()
        onChange();
    };

    const handleSiblingInsert = (
        reference: ComponentNode | null,
        newComponent: ComponentNode,
        position: 'before' | 'after',
    ) => {
        console.log("sibling insert", position, reference, newComponent);
        if (!reference) return;
        reference.addSibling(newComponent, position);
        onChange();
    };

    const handleInsertInto = (parent: ComponentNode, newComponent: ComponentNode) => {
        parent.addChild(newComponent);
        console.log("add comp", newComponent);
        onChange();
    };

    const handleInsert = (newComponent: ComponentNode) => {
        site.addChild(newComponent);
        console.log("add comp", newComponent);
        onChange();
    };

    return (
        <div className="h-full w-full overflow-y-auto">
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
                    className="border-2 border-red-500 md:w-[90%] md:m-auto w-full m-4 overflow-x-auto"
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

function createWrapperOverlay(component: ComponentNode) {
    // DOM surgery here, this code will insert a wrapper div around the html of the 
    // current component. If this is a container component, the html of the child
    // elements should already have this wrapper around them, because their html must 
    // be created before the container component's.

    // add an overlay wrapper div, maybe could also contain the container empty placeholder?
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style.position = "relative";
    wrapperDiv.dataset.wrapperId = component.id

    // TODO: fix wrapper not allowing elements to take up the entire width 
    // of the container e.g Row
    // it's not nice if the editor is off from the final page...

    // add a floating tab in the top left with the name of the component
    const nameTab = document.createElement("div");
    nameTab.innerText = component.componentName;
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
    
    function onMouseOver() {
        wrapperDiv.style.outline = "2px dashed hsl(0, 0%, 20%)";
        wrapperDiv.style.backgroundColor = "hsl(0, 0%, 80%, 0.3)";
        nameTab.style.display = "block";
    }

    function onMouseLeave() {
        wrapperDiv.style.outline = "";
        wrapperDiv.style.backgroundColor = "";
        nameTab.style.display = "none";
    }

    // TODO: this is not good, creates too many 'dangling' events
    // event leaks lol;
    // instead find the component by id and invoke onMouseOver like that
    EventDispatcher.addHandler(`tabover-${component.id}`, () => onMouseOver());
    EventDispatcher.addHandler(`tableave-${component.id}`, () => onMouseLeave());

    wrapperDiv.onmouseenter = onMouseOver;
    wrapperDiv.onmouseleave = onMouseLeave;

    return wrapperDiv;
}

function addEmptyContainerPlaceholder(
    node: ComponentNode,
    openComponentSelector: (onInsert: (comp: ComponentNode) => void) => void,
    onChange: () => void,
) {
    // DOM surgery here, this code will insert a placeholder div in the wrapper div 
    // of an empty container component, that has an 'add' button to add new components to it.

    if (!node.wrapperDiv) {
        console.log("no wrapper div on node", node);
        return;
    }

    if (!node.children || node.children.length > 0) return;

    function addChild(e: Event) {
        e.stopPropagation();

        // open the component selector modal, add a component and update the page (onChange)
        openComponentSelector(newComponent => {
            node.addChild(newComponent);
            onChange();
        });
    }

    const placeholder = createPlaceholder(node.componentName, addChild);
    placeholder.dataset.editorPlaceholder = node.id;

    // placeholder already present
    const placeholderAttr = "[data-editor-placeholder]";
    if (node.wrapperDiv.querySelector(placeholderAttr)) return;

    // insert the placeholder as the last element of the wrapper
    node.wrapperDiv.insertAdjacentElement("beforeend", placeholder);
}

// TODO: maybe add an 'add' button if there are children?
function removeEmptyContainerPlaceholder(node: ComponentNode | Page) {
    if (node.type === "Page") return;

    if (!node.children || node.children.length === 0) return;

    // always remove the placeholder
    (node as ComponentNode).wrapperDiv?.querySelector(`[data-editor-placeholder="${node.id}"]`)?.remove();
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

