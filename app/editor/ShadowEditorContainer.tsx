"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { useState } from "react";
import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { useComponentSelection } from "@/app/editor/hooks/useComponentSelection";
import { EditorContextMenu } from "@/components/preview/editor/EditorContextMenu";
import { ComponentSelector } from "@/components/component-editor/component-input/ComponentSelector";


interface ShadowEditorContainerProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
}

export function ShadowEditorContainer({
    component,
    children,
}: ShadowEditorContainerProps) {

    // we can't do anything if we don't have a DOM node
    if (!component.domNode) return null;

    const [isHovered, setIsHovered] = useState(false);
    const [overlayEnabled, setOverlayEnabled] = useState(false);
    const { site, setSite } = useSiteStore();

    const { selectComponent } = useComponentSelection();

    const handleRemove = (comp: ComponentDescriptor) => {
        ComponentContainer.removeChild(comp);
        setSite(site);
    };

    const handleChildInsert = (newComponent: ComponentDescriptor, position?: 'before' | 'after') => {
        if (position) {
            ComponentContainer.addSibling(component, newComponent, position);
        } else {
            ComponentContainer.addChild(component, newComponent);
        }
        setSite(site);
    };

    const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;

    const rect = component.domNode!.getBoundingClientRect();

    console.log("editor container render", component.id);

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
                    console.log("mouse enter", component.id);
                    setIsHovered(true);
                }}
                onMouseLeave={(e) => {
                    console.log("mouse leave", component.id);
                    setIsHovered(false);
                }}
                onClick={e => e.stopPropagation()}
                style={{
                    position: "absolute",
                    left: rect.x + window.scrollX + 'px',
                    top: rect.y + window.scrollY + 'px',
                    width: rect.width + 'px',
                    height: rect.height + 'px',
                }}
            >
                {isHovered && (
                    <div
                        className="absolute inset-0 z-10 pointer-events-none outline outline-2 outline-primary/20 rounded-sm"
                    >
                        <div className="absolute top-0 left-0 bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-br-sm">
                            {component.name}
                        </div>
                    </div>
                )}

                {
                    isEmpty && <EmptyState component={component} onInsert={handleChildInsert} />
                }

                {children}
            </div>
        </EditorContextMenu >
    );
}

function EmptyState({ component, onInsert }: { component: ComponentDescriptor, onInsert: (comp: ComponentDescriptor) => void }) {

    return (
        <div
            className="min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg m-4 p-6"
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
