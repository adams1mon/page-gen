"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
//import { EditorOverlay } from "./EditorOverlay";
//import { EditorContextMenu } from "./EditorContextMenu";
import { useEffect, useRef, useState } from "react";
//import { ComponentSelector } from "../../component-editor/component-input/ComponentSelector";
import { insertChild, removeChild } from "@/lib/components-meta/ComponentContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { findParentComponent, findComponentIndex } from "@/lib/components-meta/ComponentContainer";
import { updateComponentInTree } from "@/lib/components-meta/ComponentContainer";
import { useComponentSelection } from "@/app/editor/hooks/useComponentSelection";
import { tag } from "@/lib/components/Site";

interface ShadowEditorContainerProps extends React.PropsWithChildren {
    comp: ComponentDescriptor;
}

const overlayState: {[key: string]: any} = {};

export function ShadowEditorContainer({ comp }: ShadowEditorContainerProps) {

    const ref = useRef(null);

    const [isHovered, setIsHovered] = useState(false);
    const [overlayEnabled, setOverlayEnabled] = useState(false);
    const { site, setSite } = useSiteStore();

    const { selectComponent } = useComponentSelection();

    const handleRemove = (comp: ComponentDescriptor) => {
        const parent = findParentComponent(site, comp);
        if (parent) {
            const updatedParent = removeChild(parent, comp);
            setSite(updateComponentInTree(site, updatedParent));
        }
    };

    const handleChildInsert = (newComponent: ComponentDescriptor, position?: 'before' | 'after') => {

        if (position) {
            const parent = findParentComponent(site, component);
            if (parent) {
                parent.addChild?.(newComponent) || console.log("no function");

                //const index = findComponentIndex(parent, component);
                //const insertIndex = position === 'before' ? index : index + 1;
                //const updatedParent = insertChild(parent, newComponent, insertIndex);
                //setSite(updateComponentInTree(site, updatedParent));
            }
        } else {
            component.addChild?.(newComponent) || console.log("no function");

            // Add inside the component as before
            //const updatedComp = insertChild(component, newComponent);
            //setSite(updateComponentInTree(site, updatedComp));
        }
    };

    //const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;

    useEffect(() => {
        if (!ref.current) return;

        createMouseHandlers();
        return () => removeMouseHandlers();

    }, [comp, ref.current]);

    function createMouseHandlers() {
        console.log("adding mouser handlers");

        if (!comp.domNode) {
            console.warn("no DOM node on ", comp.type);
            return;
        }

        comp.domNode.onmouseenter = addOverlay;
        comp.domNode.onmouseleave = removeOverlay;
    }

    function addOverlay() {
        const node = comp.domNode!;

        //node.rect
        //node.style.outline = "dashed red";
        const rect = node.getBoundingClientRect();
        console.log("enter", overlayState);
        
        const outlineDiv = tag("div", { id: `outline-${comp.id}` });
        outlineDiv.style.position = "absolute";
        outlineDiv.style.left = rect.x + 'px';
        outlineDiv.style.top = rect.y + 'px';
        outlineDiv.style.width = rect.width + 'px';
        outlineDiv.style.height = rect.height + 'px';
        outlineDiv.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        outlineDiv.style.outline = "solid 1px red";
        outlineDiv.style.pointerEvents = "none";

        //console.log("outline div", outlineDiv);

        ref.current!.appendChild(outlineDiv);

        // create a little tab
        const tab = tag("p", {id: `tab-${comp.id}`});

        //const cls = "absolute inset-0 z-10 pointer-events-none";
        const cls = "bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-br-sm"
        tab.classList.add(...cls.split(" "));
        tab.innerText = comp.name

        tab.style.position = "absolute";
        tab.style.left = '0px';
        tab.style.height = '1rem';
        tab.style.top = '-1rem';
        outlineDiv.appendChild(tab);

        //ref.current!.appendChild(tab);

        //{isHovered && (
        //    <div className="absolute inset-0 z-10 pointer-events-none">
        //        <div className="absolute inset-0 outline outline-2 outline-primary/20 rounded-sm" />
        //        <div className="absolute top-0 left-0 bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-br-sm">
        //            {component.name}
        //        </div>
        //    </div>
        //)}
    }

    function removeOverlay() {
        console.log("leave", overlayState);
        
        const node = comp.domNode!;
        node.style.outline = "none";

        const tab = ref.current!.querySelector(`#tab-${comp.id}`);
        if (!tab) {
            console.warn("overlay tab not found on ", comp);
        } else {
            tab.remove();
        }

        const outlineDiv = ref.current!.querySelector(`#outline-${comp.id}`);
        if (!outlineDiv) {
            console.warn("overlay tab not found on ", comp);
        } else {
            outlineDiv.remove();
        }
    }

    function removeMouseHandlers() {
        console.log("removing mouse handlers");

        if (!comp.domNode) {
            console.warn("no DOM node on ", comp.type);
            return;
        }

        comp.domNode.onmouseover = null;
        comp.domNode.onmouseleave = null;
    }

    return (
        <div ref={ref}></div>
        //<EditorContextMenu
        //    component={component}
        //    overlayEnabled={overlayEnabled}
        //    onOverlayToggle={() => setOverlayEnabled(prev => !prev)}
        //    onEdit={() => selectComponent(component)}
        //    onInsert={handleChildInsert}
        //    onRemove={handleRemove}
        //>
        //    <div
        //        className="relative"
        //        onMouseEnter={(e) => {
        //            e.stopPropagation();
        //            setIsHovered(true);
        //        }}
        //        onMouseLeave={(e) => {
        //            e.stopPropagation();
        //            setIsHovered(false);
        //        }}
        //        onClick={e => e.stopPropagation()}
        //    >
        //        <EditorOverlay
        //            controlsEnabled={overlayEnabled}
        //            isHovered={isHovered}
        //            component={component}
        //            onEdit={() => selectComponent(component)}
        //            onInsert={handleChildInsert}
        //            onRemove={handleRemove}
        //        />
        //
        //        {children}
        //
        //        {isEmpty && <EmptyState component={component} onInsert={handleChildInsert} />}
        //    </div>
        //</EditorContextMenu>
    );
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
