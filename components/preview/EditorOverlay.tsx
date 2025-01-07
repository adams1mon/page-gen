"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { ComponentInput } from "../component-editor/component-input/ComponentInput";
import { PropInputs } from "../component-editor/dynamic-input/PropInputs";
import { ComponentSelectorDropdown } from "../component-editor/component-input/ComponentDivider";
import { Copy, Edit, Plus, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { useComponentClipboard } from "@/lib/store/component-clipboard-context";
import { CompFunc } from "./PreviewTest";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";


interface EditorOverlayProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
    onChange: CompFunc;
    onRemove?: CompFunc;
}

interface EditorPosition {
    x: number;
    y: number;
    maxHeight: number;
}

export function EditorOverlay({ component, onChange, onRemove, children }: EditorOverlayProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [editorPosition, setEditorPosition] = useState<EditorPosition>({ x: 0, y: 0, maxHeight: 300 });
    const { copy } = useComponentClipboard();
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        }

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isEditing]);

    const toggleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        setEditorPosition({
            x: rect.left / 2,
            y: rect.height * 1.4,
            maxHeight: (window.innerHeight - e.clientY) * 0.9,
        });
        setIsEditing(prev => !prev);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.(component);
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        copy(component);
    };

    const handleChildInsert = (newComponent: ComponentDescriptor) => {
        onChange({
            ...component,
            childrenDescriptors: [...component.childrenDescriptors, newComponent],
        });
    }

    const handleMouseEnter = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsHovered(true);
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsHovered(false);
    };

    const handleContextMenuEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setEditorPosition({
            x: rect.left,
            y: rect.bottom,
            maxHeight: window.innerHeight - rect.bottom * 1.1,
        });
        setIsEditing(true);
    };

    const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={e => e.stopPropagation()}
                >
                    {isHovered && (
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="absolute inset-0 outline outline-2 outline-primary/20 rounded-sm" />
                            <div className="absolute top-0 left-0 bg-background/80 backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-br-sm">
                                {component.name}
                            </div>
                        </div>
                    )}

                    <div
                        className={cn(
                            "absolute top-0 right-0 z-20 transition-opacity duration-200",
                            isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
                        )}
                    >
                        <TooltipProvider>
                            <div className="flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm">
                                {component.acceptsChildren && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div>
                                                <ComponentSelectorDropdown onInsert={handleChildInsert}>
                                                    <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </ComponentSelectorDropdown>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>Add component</TooltipContent>
                                    </Tooltip>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={toggleEdit}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit properties</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copy component</TooltipContent>
                                </Tooltip>
                                {onRemove && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete component</TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </TooltipProvider>
                    </div>

                    {isEditing && (
                        <div
                            ref={editorRef}
                            className="fixed z-50 min-w-[300px] bg-background border rounded-lg shadow-lg overflow-y-auto"
                            style={{
                                left: `${editorPosition.x}px`,
                                top: `${editorPosition.y}px`,
                                maxHeight: `${editorPosition.maxHeight}px`,
                            }}
                        >
                            <div className="flex items-center justify-between p-2 border-b sticky top-0 bg-background">
                                <span className="font-medium capitalize text-sm">{component.name}</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
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
                    )}

                    {children}

                    {isEmpty && (
                        <div className="min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg m-4 p-6">
                            <div className="text-center space-y-2 mb-4">
                                <p className="text-lg font-medium text-muted-foreground">{component.name}</p>
                                <p className="text-sm text-muted-foreground/60">This component is empty.</p>
                            </div>
                            <ComponentSelectorDropdown onInsert={handleChildInsert}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add component
                                </Button>
                            </ComponentSelectorDropdown>
                        </div>
                    )}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                {component.acceptsChildren && (
                    <ComponentSelectorDropdown onInsert={handleChildInsert}>
                        <ContextMenuItem className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add component
                        </ContextMenuItem>
                    </ComponentSelectorDropdown>
                )}
                <ContextMenuItem onClick={handleContextMenuEdit} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit properties
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCopy} className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy component
                </ContextMenuItem>
                {onRemove && (
                    <ContextMenuItem onClick={handleDelete} className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete component
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
