"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { ComponentSelector } from "../../component-editor/component-input/ComponentSelector";
import { Clipboard, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { useComponentClipboard } from "@/lib/store/component-clipboard-context";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

interface EditorContextMenuProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
    overlayEnabled: boolean;
    onOverlayToggle: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onInsert: (component: ComponentDescriptor, position?: 'before' | 'after') => void;
    onRemove?: (component: ComponentDescriptor) => void;
}

export function EditorContextMenu({
    component,
    overlayEnabled,
    onOverlayToggle,
    onEdit,
    onInsert,
    onRemove,
    children,
}: EditorContextMenuProps) {
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
                <ContextMenuItem className="flex flex-col items-center mb-2">
                    <p className="m-0">{component.name}</p>
                    <hr className="w-full mt-2" />
                </ContextMenuItem>

                {/* Insert Above */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Insert Above
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ComponentSelector onInsert={(comp) => onInsert(comp, 'before')}>
                            <ContextMenuItem>
                                Add Component
                            </ContextMenuItem>
                        </ComponentSelector>
                        {hasCopiedComponent() && (
                            <ContextMenuItem onClick={() => {
                                const comp = paste();
                                if (comp) onInsert(comp, 'before');
                            }}>
                                <Clipboard className="h-4 w-4 mr-2" />
                                Paste Component
                            </ContextMenuItem>
                        )}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                {/* Insert Below */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Insert Below
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ComponentSelector onInsert={(comp) => onInsert(comp, 'after')}>
                            <ContextMenuItem>
                                Add Component
                            </ContextMenuItem>
                        </ComponentSelector>
                        {hasCopiedComponent() && (
                            <ContextMenuItem onClick={() => {
                                const comp = paste();
                                if (comp) onInsert(comp, 'after');
                            }}>
                                <Clipboard className="h-4 w-4 mr-2" />
                                Paste Component
                            </ContextMenuItem>
                        )}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                {/* Add Inside (if component accepts children) */}
                {component.acceptsChildren && (
                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Inside
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ComponentSelector onInsert={onInsert}>
                                <ContextMenuItem>
                                    Add Component
                                </ContextMenuItem>
                            </ComponentSelector>
                            {hasCopiedComponent() && (
                                <ContextMenuItem onClick={() => {
                                    const comp = paste();
                                    if (comp) onInsert(comp);
                                }}>
                                    <Clipboard className="h-4 w-4 mr-2" />
                                    Paste Component
                                </ContextMenuItem>
                            )}
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                )}

                <ContextMenuItem onClick={onEdit} className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit properties
                </ContextMenuItem>

                <ContextMenuItem
                    onClick={() => copy(component)}
                    className="flex items-center"
                >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy component
                </ContextMenuItem>

                <ContextMenuItem
                    className="flex items-center"
                    onClick={onOverlayToggle}
                >
                    <Switch checked={overlayEnabled} className="transition-none" />
                    Overlay enabled
                </ContextMenuItem>

                {onRemove && (
                    <ContextMenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove(component);
                        }}
                        className="flex items-center text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete component
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}