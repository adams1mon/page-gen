"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
//import { EditorOverlay } from "./EditorOverlay";
//import { EditorContextMenu } from "./EditorContextMenu";
import { useEffect, useRef, useState } from "react";
//import { ComponentSelector } from "../../component-editor/component-input/ComponentSelector";
import { ComponentContainer, insertChild, removeChild } from "@/lib/components-meta/ComponentContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { findParentComponent, findComponentIndex } from "@/lib/components-meta/ComponentContainer";
import { updateComponentInTree } from "@/lib/components-meta/ComponentContainer";
import { useComponentSelection } from "@/app/editor/hooks/useComponentSelection";
import { tag } from "@/lib/components/Site";
import { EditorContextMenu } from "@/components/preview/editor/EditorContextMenu";
import { createPortal } from "react-dom";

interface ShadowEditorContainerProps extends React.PropsWithChildren {
    comp: ComponentDescriptor;
}

function getAllElementsFromTree(comp: ComponentDescriptor, arr: ComponentDescriptor[] = []): ComponentDescriptor[] {

    arr.push(comp);

    if (comp.acceptsChildren) {
        comp.childrenDescriptors.map(c => getAllElementsFromTree(c, arr));
    }

    return arr;
}

//export function ShadowEditorContainer({ comp }: ShadowEditorContainerProps) {
//
//    const ref = useRef(null);
//
//    const { site, setSite } = useSiteStore();
//
//    const { selectComponent } = useComponentSelection();

//useEffect(() => {
//    if (!ref.current) return;
//
//    console.log("adding listeners");
//
//    getAllElementsFromTree(comp).forEach(addMouseHandlers);
//    return () => getAllElementsFromTree(comp).forEach(removeMouseHandlers);
//
//    //createMouseHandlers(component);
//    //return () => removeMouseHandlers();
//
//}, [comp, ref.current]);

//if (ref.current) {
//console.log("adding listeners");

//getAllElementsFromTree(comp).forEach(addMouseHandlers);
//}

//function addMouseHandlers(component: ComponentDescriptor) {
//    console.log("adding mouse handlers");
//
//    if (!component.domNode) {
//        console.warn("no DOM node on ", component.type);
//        return;
//    }
//
//    component.domNode.onmouseenter = () => addOverlay(component);
//    component.domNode.onmouseleave = () => removeOverlay(component);
//}
//
//function removeMouseHandlers(component: ComponentDescriptor) {
//    console.log("removing mouse handlers");
//
//    if (!component.domNode) {
//        console.warn("no DOM node on ", component.type);
//        return;
//    }
//
//    component.domNode.onmouseover = null;
//    component.domNode.onmouseleave = null;
//}
//
//function addOverlay(component: ComponentDescriptor) {
//    const node = component.domNode!;
//
//    const rect = node.getBoundingClientRect();
//
//    const outlineDiv = tag("div", { id: `outline-${component.id}` });
//    outlineDiv.style.position = "absolute";
//    outlineDiv.style.left = rect.x + window.scrollX + 'px';
//    outlineDiv.style.top = rect.y + window.scrollY + 'px';
//    outlineDiv.style.width = rect.width + 'px';
//    outlineDiv.style.height = rect.height + 'px';
//    outlineDiv.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
//    outlineDiv.style.outline = "solid 1px red";
//    outlineDiv.style.pointerEvents = "none";
//
//    //outlineDiv.classList.add(..."outline outline-2 outline-primary/20 rounded-sm".split(" "));
//
//    //console.log("outline div", outlineDiv);
//
//    ref.current!.appendChild(outlineDiv);
//
//    // create a little tab with the name of the component
//    const tab = tag("p", {id: `tab-${component.id}`});
//
//    const cls = "bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium"
//    tab.classList.add(...cls.split(" "));
//    tab.innerText = component.name;
//
//    tab.style.position = "absolute";
//    tab.style.zIndex = '10';
//    tab.style.left = '0px';
//
//    // get the height and displace the tab
//    tab.style.visibility = "hidden";
//    outlineDiv.appendChild(tab);
//
//    tab.style.top = -tab.getBoundingClientRect().height  + 'px';
//    tab.style.visibility = "visible";
//}
//
//function removeOverlay(component: ComponentDescriptor) {
//
//    const node = component.domNode!;
//    node.style.outline = "none";
//
//    const tab = ref.current!.querySelector(`#tab-${component.id}`);
//    if (!tab) {
//        console.warn("overlay tab not found on ", component);
//    } else {
//        tab.remove();
//    }
//
//    const outlineDiv = ref.current!.querySelector(`#outline-${component.id}`);
//    if (!outlineDiv) {
//        console.warn("overlay tab not found on ", component);
//    } else {
//        outlineDiv.remove();
//    }
//}
//


export function ShadowEditorContainer({ comp }: ShadowEditorContainerProps) {

    const { site, setSite } = useSiteStore();

    const { selectComponent } = useComponentSelection();

    return (
        <div>
            {
                //ref.current != null && getAllElementsFromTree(comp).map(c =>
                //
                //    createPortal(
                //        <EditorContextMenu
                //            component={c}
                //            overlayEnabled={false}
                //            onOverlayToggle={() => console.log("toggle overlay")}
                //
                //            onEdit={() => selectComponent(c)}
                //
                //            onInsert={handleChildInsert}
                //            onRemove={handleRemove}
                //        />,
                //        ref.current,
                //    )
                //)
            }
        </div>
    );
    //{children}
    //
    //{isEmpty && <EmptyState component={component} onInsert={handleChildInsert} />}
}

function EmptyState({ component, onInsert }: { component: ComponentDescriptor, onInsert: (comp: ComponentDescriptor) => void }) {
    return (
        <div className="min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg m-4 p-6">
            <div className="text-center space-y-2 mb-4">
                <p className="text-lg font-medium text-muted-foreground">{component.name}</p>
                <p className="text-sm text-muted-foreground/60">This component is empty.</p>
            </div>
            <ComponentSelector onInsert={onInsert} >
                <Button
                    variant="outline"
                    className="bg-background border-border"
                >
                    <div className="flex gap-2 text-muted-foreground">
                        <Plus className="h-4 w-4" />
                        <span>Add component</span>
                    </div>
                </Button>
            </ComponentSelector>
        </div>
    );
}
