"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { CompFunc } from "./PreviewEditor";
import { EditorOverlay } from "./EditorOverlay";
import { EditorPopover } from "./EditorPopover";
import { EditorContextMenu } from "./EditorContextMenu";
import { useState } from "react";
import { ComponentSelector } from "../../component-editor/component-input/ComponentSelector";
import { insertChild } from "@/lib/components-meta/ComponentContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EditorContainerProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
    onChange: CompFunc;
    onRemove?: CompFunc;
}

export interface EditorPosition {
    x: number;
    y: number;
    maxHeight: number;
}

export function EditorContainer({ component, onChange, onRemove, children }: EditorContainerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [overlayEnabled, setOverlayEnabled] = useState(false);
    const [editorPosition, setEditorPosition] = useState<EditorPosition>({ x: 0, y: 0, maxHeight: 300 });

    const handleChildInsert = (newComponent: ComponentDescriptor) => {
        onChange(insertChild(component, newComponent));
    };

    const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;

    return (
        <EditorContextMenu
            component={component}
            overlayEnabled={overlayEnabled}
            onOverlayToggle={() => setOverlayEnabled(prev => !prev)}
            onEdit={(e) => {
                const minWidth = 400;
                const minHeight = 600;

                let x = Math.max(10, e.clientX - minWidth / 2);
                let y = e.clientY + 10;

                // out on right
                if (e.clientX + minWidth > window.innerWidth) {
                    x = window.innerWidth - minWidth;
                }

                // out on the bottom
                if (e.clientY + minHeight > window.innerHeight) {
                    y = window.innerHeight - minHeight;
                }

                setEditorPosition({
                    x,
                    y,
                    maxHeight: window.innerHeight * 0.9,
                });
                setIsEditing(true);
            }}
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
                    onEdit={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setEditorPosition({
                            x: rect.left / 2,
                            y: rect.height * 1.4,
                            maxHeight: (window.innerHeight - e.clientY) * 0.9,
                        });
                        setIsEditing(true);
                    }}
                    onInsert={handleChildInsert}
                    onRemove={onRemove}
                />

                {isEditing && (
                    <EditorPopover
                        component={component}
                        position={editorPosition}
                        onClose={() => setIsEditing(false)}
                        onChange={onChange}
                    />
                )}

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
