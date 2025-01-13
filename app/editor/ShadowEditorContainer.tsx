"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { useState } from "react";
import { removeChild } from "@/lib/components-meta/ComponentContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { findParentComponent, findComponentIndex } from "@/lib/components-meta/ComponentContainer";
import { updateComponentInTree } from "@/lib/components-meta/ComponentContainer";
import { useComponentSelection } from "@/app/editor/hooks/useComponentSelection";
import { tag } from "@/lib/components/Site";
import { EditorContextMenu } from "@/components/preview/editor/EditorContextMenu";
import { createPortal } from "react-dom";
import { ComponentSelector } from "@/components/component-editor/component-input/ComponentSelector";

interface ShadowEditorContainerProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
}

//function getAllElementsFromTree(comp: ComponentDescriptor, arr: ComponentDescriptor[] = []): ComponentDescriptor[] {
//
//    arr.push(comp);
//
//    if (comp.acceptsChildren) {
//        comp.childrenDescriptors.map(c => getAllElementsFromTree(c, arr));
//    }
//
//    return arr;
//}

export function ShadowEditorContainer({
    component,
}: ShadowEditorContainerProps) {

    // we can't do anything if we don't have a DOM node
    if (!component.domNode) return null;

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

    const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;

    const rect = component.domNode!.getBoundingClientRect();

    console.log("editor container render");

    return (
        <EditorContextMenu
            component={component}
            overlayEnabled={overlayEnabled}
            onOverlayToggle={() => setOverlayEnabled(prev => !prev)}
            onEdit={() => selectComponent(component)}
            onInsert={handleChildInsert}
            onRemove={handleRemove}
        >
            <div
                onMouseEnter={(e) => {
                    e.stopPropagation();

                    console.log("mouse enter", component);

                    setIsHovered(true);
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();

                    console.log("mouse leave", component);

                    setIsHovered(false);
                }}
                onClick={e => e.stopPropagation()}
                style={{
                    position: "absolute",
                    left: rect.x + window.scrollX + 'px',
                    top: rect.y + window.scrollY + 'px',
                    width: rect.width + 'px',
                    height: rect.height + 'px',
                    //backgroundColor: isHovered ? "rgba(255, 0, 0, 0.2)" : "rgba(255, 0, 0, 0.05)",
                    //outline: "solid 1px red",
                }}
            >
                {isHovered && (
                    <div
                        className="absolute inset-0 z-10 pointer-events-none outline outline-2 outline-primary/20 rounded-sm"
                    //className="outline outline-2 outline-primary/20 rounded-sm"
                    //style={{
                    //    //backgroundColor: isHovered ? "rgba(255, 0, 0, 0.2)" : "rgba(255, 0, 0, 0.05)",
                    //    //outline: "solid 1px red",
                    //}}
                    >
                        <div className="absolute top-0 left-0 bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-br-sm">
                            {component.name}
                        </div>
                    </div>
                )}

                {
                    isEmpty && <EmptyState component={component} onInsert={handleChildInsert} />
                }
            </div>
        </EditorContextMenu >
    );
}

function EmptyState({ component, onInsert }: { component: ComponentDescriptor, onInsert: (comp: ComponentDescriptor) => void }) {

    const rect = component.domNode!.getBoundingClientRect();

    return (
        <div
            className="min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg m-4 p-6"
            style={{
                //position: "absolute",
                //left: rect.x + window.scrollX + 'px',
                //top: rect.y + window.scrollY + 'px',
                //width: rect.width + 'px',
                //height: rect.height + 'px',
                ////backgroundColor: isHovered ? "rgba(255, 0, 0, 0.2)" : "rgba(255, 0, 0, 0.05)",
                //outline: "solid 1px blue",
            }}
        >

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
