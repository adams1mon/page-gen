"use client";

import { Clipboard, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { ComponentSelector } from "@/components/component-editor/component-input/ComponentSelector";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";
import { useComponentClipboard } from "../hooks/useComponentClipboard";
import { useComponentSelection } from "../hooks/useComponentSelection";
import { useEffect, useState } from "react";
import { useRClickedComponent } from "../hooks/useRClickComponent";
import { useComponentSelector } from "@/lib/store/component-selector-store";

type CompFunc = (comp: ComponentNode<any>) => void;

interface ComponentContextMenuProps extends React.PropsWithChildren {
    onInsertInto: (parent: ComponentNode<any>, compToAdd: ComponentNode<any>) => void;
    onInsertBefore: CompFunc;
    onInsertAfter: CompFunc;
    onRemove: CompFunc;
};

export function EditorContextMenu({
    onInsertInto,
    onInsertBefore,
    onInsertAfter,
    onRemove,
    children,
}: ComponentContextMenuProps) {
    const { copy, paste, hasCopiedComponent } = useComponentClipboard();
    const { selectComponent } = useComponentSelection();
    const [isOpen, setIsOpen] = useState(true);
    const { rClickedComponent } = useRClickedComponent();
    const { openComponentSelector } = useComponentSelector();

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

    function pasteMenuItem() {
        return hasCopiedComponent() && (
            <ContextMenuItem onClick={() => {
                const comp = paste();
                if (comp) onInsertAfter(comp);
                setIsOpen(false);
            }}>
                <Clipboard className="h-4 w-4 mr-2" />
                Paste Component
            </ContextMenuItem>
        );
    }

    return (
        <ContextMenu open={isOpen} onOpenChange={setIsOpen}>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            {rClickedComponent &&
                <ContextMenuContent className="w-48">
                    <ContextMenuItem className="flex flex-col items-center mb-2">
                        <p className="m-0">{rClickedComponent.type}</p>
                        <hr className="w-full mt-2" />
                    </ContextMenuItem>

                    {/* Insert Above */}
                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Insert Above
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuItem 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openComponentSelector(onInsertBefore);
                                    setIsOpen(false);
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Component
                            </ContextMenuItem>
                            {pasteMenuItem()}
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    {/* Insert Below */}
                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Insert Below
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuItem 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openComponentSelector(onInsertAfter);
                                    setIsOpen(false);
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Component
                            </ContextMenuItem>
                            {pasteMenuItem()}
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    {/* Add Inside (if component accepts children) */}
                    {"children" in rClickedComponent && (
                        <ContextMenuSub>
                            <ContextMenuSubTrigger className="flex items-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Inside
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <ContextMenuItem 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openComponentSelector(newComp => onInsertInto(rClickedComponent, newComp));
                                        setIsOpen(false);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Component
                                </ContextMenuItem>
                                {pasteMenuItem()}
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    )}

                    <ContextMenuItem
                        onClick={() => {
                            selectComponent(rClickedComponent);
                            setIsOpen(false);
                        }}
                        className="flex items-center"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit properties
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={() => {
                            copy(rClickedComponent);
                            setIsOpen(false);
                        }}
                        className="flex items-center"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy component
                    </ContextMenuItem>

                    {onRemove && (
                        <ContextMenuItem
                            onClick={() => {
                                onRemove(rClickedComponent);
                                setIsOpen(false);
                            }}
                            className="flex items-center text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete component
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            }

            <ComponentSelector />
        </ContextMenu>
    );
}
