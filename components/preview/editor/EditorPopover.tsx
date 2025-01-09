"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { PropInputs } from "../../component-editor/prop-editor/PropInputs";
import { ComponentInput } from "../../component-editor/component-input/ComponentInput";
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useRef } from "react";
import { EditorPosition } from "./EditorContainer";

interface EditorPopoverProps {
    component: ComponentDescriptor;
    position: EditorPosition;
    onClose: () => void;
    onChange: (component: ComponentDescriptor) => void;
}

export function EditorPopover({ component, position, onClose, onChange }: EditorPopoverProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={editorRef}
            className="fixed z-50 min-w-[400px] bg-background border rounded-lg shadow-lg overflow-y-auto"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                maxHeight: `${position.maxHeight}px`,
                minHeight: "200px",
                minWidth: "400px",
            }}
        >
            <div className="flex items-center justify-between p-2 border-b z-50 sticky top-0 bg-background">
                <span className="font-medium capitalize text-sm my-0 px-2">{component.name}</span>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="p-4">
                <PropInputs
                    propsDescriptor={component.propsDescriptor}
                    props={component.props}
                    onChange={newProps => onChange({ ...component, props: newProps })}
                />
                {component.acceptsChildren && (
                    <ComponentInput
                        components={component.childrenDescriptors}
                        onChange={components => onChange({
                            ...component,
                            childrenDescriptors: components
                        })}
                    />
                )}
            </div>
        </div>
    );
}
