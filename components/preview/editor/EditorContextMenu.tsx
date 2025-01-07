"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { ComponentSelector } from "./ComponentSelector";
import { Clipboard, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { useComponentClipboard } from "@/lib/store/component-clipboard-context";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";

interface EditorContextMenuProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
    onEdit: (e: React.MouseEvent) => void;
    onInsert: (component: ComponentDescriptor) => void;
    onRemove?: (component: ComponentDescriptor) => void;
}

export function EditorContextMenu({ component, onEdit, onInsert, onRemove, children }: EditorContextMenuProps) {
    
    const { copy, paste, hasCopiedComponent } = useComponentClipboard();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isOpen && !(event.target as Element).closest('[role="menu"]')) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);


    return (
        <ContextMenu open={isOpen} onOpenChange={setIsOpen}>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                {component.acceptsChildren && (
                    <ComponentSelector onInsert={onInsert}>
                        <ContextMenuItem className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add component
                        </ContextMenuItem>
                    </ComponentSelector>
                )}
                {component.acceptsChildren && hasCopiedComponent() && (
                    <ComponentSelector onInsert={() => {
                        const component = paste();
                        if (component) {
                            onInsert(component);
                        }
                    }}>
                        <ContextMenuItem className="flex items-center gap-2">
                            <Clipboard className="h-4 w-4" />
                            Paste component
                        </ContextMenuItem>
                    </ComponentSelector>
                )}
                <ContextMenuItem onClick={onEdit} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit properties
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        copy(component);
                    }}
                    className="flex items-center gap-2"
                >
                    <Copy className="h-4 w-4" />
                    Copy component
                </ContextMenuItem>
                {onRemove && (
                    <ContextMenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove(component);
                        }}
                        className="flex items-center gap-2 text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete component
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
