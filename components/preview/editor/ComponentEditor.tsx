"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { CompFunc } from "../PreviewTest";
import { EditorOverlay } from "./EditorOverlay";
import { EditorPopover } from "./EditorPopover";
import { EditorContextMenu } from "./EditorContextMenu";
import { useState } from "react";
import { ComponentSelector } from "./ComponentSelector";

interface ComponentEditorProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
    onChange: CompFunc;
    onRemove?: CompFunc;
}

export interface EditorPosition {
    x: number;
    y: number;
    maxHeight: number;
}

export function ComponentEditor({ component, onChange, onRemove, children }: ComponentEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [editorPosition, setEditorPosition] = useState<EditorPosition>({ x: 0, y: 0, maxHeight: 300 });

    const handleChildInsert = (newComponent: ComponentDescriptor) => {
        onChange({
            ...component,
            childrenDescriptors: [...component.childrenDescriptors, newComponent],
        });
    };

    const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;

    return (
        <EditorContextMenu
            component={component}
            onEdit={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                setEditorPosition({
                    x: rect.left,
                    y: rect.bottom,
                    maxHeight: window.innerHeight - rect.bottom * 1.1,
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
            <ComponentSelector onInsert={onInsert} />
        </div>
    );
}