"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { PropInputs } from "../../component-editor/dynamic-input/PropInputs";
import { ComponentInput } from "../../component-editor/component-input/ComponentInput";
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useRef } from "react";
import { EditorPosition } from "./ComponentEditor";

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
            className="fixed z-50 min-w-[300px] bg-background border rounded-lg shadow-lg overflow-y-auto"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                maxHeight: `${position.maxHeight}px`,
            }}
        >
            <div className="flex items-center justify-between p-2 border-b z-50 sticky top-0 bg-background">
                <span className="font-medium capitalize text-sm">{component.name}</span>
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