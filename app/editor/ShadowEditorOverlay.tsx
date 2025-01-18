//"use client";
//
//import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
//import { ComponentSelector } from "../../component-editor/component-input/ComponentSelector";
//import { Copy, Edit, Plus, Trash2, Clipboard } from "lucide-react";
//import { Button } from "../../ui/button";
//import { useComponentClipboard } from "@/lib/store/component-clipboard-context";
//import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
//import { cn } from "@/lib/utils";
//
//interface ShadowEditorOverlayProps {
//    isHovered: boolean;
//    component: ComponentDescriptor;
//    controlsEnabled: boolean;
//    onEdit: (e: React.MouseEvent) => void;
//    onInsert: (component: ComponentDescriptor) => void;
//    onRemove?: (component: ComponentDescriptor) => void;
//}
//
//export function ShadowEditorOverlay({
//    isHovered,
//    component,
//    controlsEnabled,
//    onEdit,
//    onInsert,
//    onRemove,
//}: ShadowEditorOverlayProps) {
//    const { copy, paste, hasCopiedComponent } = useComponentClipboard();
//
//    return (
//        <>
//            {isHovered && (
//                <div className="absolute inset-0 z-10 pointer-events-none">
//                    <div className="absolute inset-0 outline outline-2 outline-primary/20 rounded-sm" />
//                    <div className="absolute top-0 left-0 bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-br-sm">
//                        {component.name}
//                    </div>
//                </div>
//            )}
//
//            {controlsEnabled &&
//                <div
//                    className={cn(
//                        "absolute top-0 right-0 z-20 transition-opacity duration-200",
//                        isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
//                    )}
//                >
//                    <TooltipProvider>
//                        <div className="flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm">
//                            {component.acceptsChildren && (
//                                <Tooltip>
//                                    <TooltipTrigger asChild>
//                                        <div>
//                                            <ComponentSelector onInsert={onInsert}>
//                                                <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
//                                                    <Plus className="h-4 w-4" />
//                                                </Button>
//                                            </ComponentSelector>
//                                        </div>
//                                    </TooltipTrigger>
//                                    <TooltipContent>Add component</TooltipContent>
//                                </Tooltip>
//                            )}
//                            {component.acceptsChildren && hasCopiedComponent() &&
//                                <Tooltip>
//                                    <TooltipTrigger asChild>
//                                        <Button
//                                            variant="ghost"
//                                            size="icon"
//                                            onClick={(e) => {
//                                                e.stopPropagation();
//                                                const component = paste();
//                                                if (component) {
//                                                    onInsert(component);
//                                                }
//                                            }}
//                                        >
//                                            <Clipboard className="h-4 w-4" />
//                                        </Button>
//                                    </TooltipTrigger>
//                                    <TooltipContent>Paste component</TooltipContent>
//                                </Tooltip>
//                            }
//                            <Tooltip>
//                                <TooltipTrigger asChild>
//                                    <Button variant="ghost" size="icon" onClick={onEdit}>
//                                        <Edit className="h-4 w-4" />
//                                    </Button>
//                                </TooltipTrigger>
//                                <TooltipContent>Edit properties</TooltipContent>
//                            </Tooltip>
//                            <Tooltip>
//                                <TooltipTrigger asChild>
//                                    <Button
//                                        variant="ghost"
//                                        size="icon"
//                                        onClick={(e) => {
//                                            e.stopPropagation();
//                                            copy(component);
//                                        }}
//                                    >
//                                        <Copy className="h-4 w-4" />
//                                    </Button>
//                                </TooltipTrigger>
//                                <TooltipContent>Copy component</TooltipContent>
//                            </Tooltip>
//                            {onRemove && (
//                                <Tooltip>
//                                    <TooltipTrigger asChild>
//                                        <Button
//                                            variant="ghost"
//                                            size="icon"
//                                            onClick={(e) => {
//                                                e.stopPropagation();
//                                                onRemove(component);
//                                            }}
//                                            className="text-destructive hover:text-destructive"
//                                        >
//                                            <Trash2 className="h-4 w-4" />
//                                        </Button>
//                                    </TooltipTrigger>
//                                    <TooltipContent>Delete component</TooltipContent>
//                                </Tooltip>
//                            )}
//                        </div>
//                    </TooltipProvider>
//                </div>
//            }
//        </>
//    );
//}
