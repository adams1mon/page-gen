"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { CompFunc } from "./PreviewEditor";
import { EditorOverlay } from "./EditorOverlay";
import { EditorContextMenu } from "./EditorContextMenu";
import { useState } from "react";
import { ComponentSelector } from "../../component-editor/component-input/ComponentSelector";
import { insertChild } from "@/lib/components-meta/ComponentContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { findParentComponent, findComponentIndex } from "@/lib/components-meta/ComponentContainer";

interface EditorContainerProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
    onChange: CompFunc;
    onRemove?: CompFunc;
    onSelect?: (component: ComponentDescriptor) => void;
}

export function EditorContainer({ 
    component, 
    onChange, 
    onRemove, 
    onSelect,
    children 
}: EditorContainerProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [overlayEnabled, setOverlayEnabled] = useState(false);
    const { site, setSite } = useSiteStore();

    const handleChildInsert = (newComponent: ComponentDescriptor, position?: 'before' | 'after') => {
        if (position) {
            const parent = findParentComponent(site, component.id);
            if (parent) {
                const index = findComponentIndex(parent, component.id);
                const insertIndex = position === 'before' ? index : index + 1;
                const updatedParent = insertChild(parent, newComponent, insertIndex);
                
                // Update the site tree with the modified parent
                const updateComponentInTree = (comp: ComponentDescriptor): ComponentDescriptor => {
                    if (comp.id === parent.id) {
                        return updatedParent;
                    }
                    if (comp.acceptsChildren) {
                        return {
                            ...comp,
                            childrenDescriptors: comp.childrenDescriptors.map(updateComponentInTree)
                        };
                    }
                    return comp;
                };
                
                setSite(updateComponentInTree(site));
            }
        } else {
            // Add inside the component as before
            onChange(insertChild(component, newComponent));
        }
    };

    const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;

    return (
        <EditorContextMenu
            component={component}
            overlayEnabled={overlayEnabled}
            onOverlayToggle={() => setOverlayEnabled(prev => !prev)}
            onEdit={() => onSelect?.(component)}
            onInsert={handleChildInsert}
            onRemove={onRemove}
        >
            <div
                className="relative"
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    setIsHovered(true);
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                    setIsHovered(false);
                }}
                onClick={e => e.stopPropagation()}
            >
                <EditorOverlay
                    controlsEnabled={overlayEnabled}
                    isHovered={isHovered}
                    component={component}
                    onEdit={() => onSelect?.(component)}
                    onInsert={handleChildInsert}
                    onRemove={onRemove}
                />

                {children}

                {isEmpty && <EmptyState component={component} onInsert={handleChildInsert} />}
            </div>
        </EditorContextMenu>
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