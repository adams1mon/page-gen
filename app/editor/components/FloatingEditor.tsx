"use client";

import { X, PictureInPicture, Minimize2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useEditorPreferences } from "@/lib/store/editor-preferences";
import { Page } from "@/lib/core/page/Page";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { Button } from "@/components/ui/button";
import { PropInputs } from "@/components/component-editor/prop-editor/PropInputs";
import { ComponentInput } from "@/components/component-editor/component-input/ComponentInput";
import { useDebounce } from "@/hooks/use-debounce";
import { useEditorTabs } from "@/lib/store/editor-tabs-store";

interface FloatingEditorProps {
    component: Page | ComponentNode;
    onClose: () => void;
    onChange: () => void;
    onDock: () => void;
}

const POSITION_SIZE_DEBOUNCE_MS = 500;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const HEADER_HEIGHT = 48;
const MARGIN = 20;

function constrainPosition(x: number, y: number, width: number, height: number) {
    const maxX = window.innerWidth - width - MARGIN;
    const maxY = window.innerHeight - height - MARGIN;

    return {
        x: Math.min(Math.max(MARGIN, x), maxX),
        y: Math.min(Math.max(MARGIN, y), maxY)
    };
}

function constrainSize(width: number, height: number, x: number, y: number) {
    const maxWidth = window.innerWidth - x - MARGIN;
    const maxHeight = window.innerHeight - y - MARGIN;

    return {
        width: Math.min(Math.max(MIN_WIDTH, width), maxWidth),
        height: Math.min(Math.max(MIN_HEIGHT, height), maxHeight)
    };
}

export function FloatingEditor({
    component,
    onClose,
    onChange,
    onDock,
}: FloatingEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const { position, size, setPosition, setSize } = useEditorPreferences();
    const { addTab } = useEditorTabs();

    const debounce = useDebounce();

    // Ensure initial position and size are within bounds
    useEffect(() => {
        const constrainedSize = constrainSize(size.width, size.height, position.x, position.y);
        const constrainedPosition = constrainPosition(
            position.x,
            position.y,
            constrainedSize.width,
            constrainedSize.height
        );

        setPosSize({
            pos: constrainedPosition,
            size: constrainedSize,
        });
    }, []);

    // Close the editor on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleDragMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const moveStart = {
            x: e.clientX,
            y: e.clientY,
        };

        // this rect better exist
        const rect = editorRef.current!.getBoundingClientRect();

        const handleMouseMove = (e: MouseEvent) => {
            const newPosition = constrainPosition(
                rect.x + (e.clientX - moveStart.x),
                rect.y + (e.clientY - moveStart.y),
                rect.width,
                rect.height
            );
            setPosSize({ pos: newPosition, dragging: true });
        };

        document.addEventListener("mousemove", handleMouseMove);

        document.addEventListener("mouseup", () => {
            setPosSize({ dragging: false });
            document.removeEventListener("mousemove", handleMouseMove);
        });
    }

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // this rect better exist
        const rect = editorRef.current!.getBoundingClientRect();

        const resizeStart = {
            x: e.clientX,
            y: e.clientY,
        };

        const handleMouseMove = (e: MouseEvent) => {
            const newSize = constrainSize(
                rect.width + (e.clientX - resizeStart.x),
                rect.height + (e.clientY - resizeStart.y),
                rect.x,
                rect.y,
            );
            setPosSize({ size: newSize });
        };

        document.addEventListener("mousemove", handleMouseMove);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleMouseMove);
        });
    };

    interface EditorSettings {
        pos?: {
            x: number,
            y: number,
        },
        size?: {
            width: number,
            height: number,
        },
        dragging?: boolean,
    };

    function setPosSize({
        pos,
        size,
        dragging = false,
    }: EditorSettings) {
        if (!editorRef.current) {
            return;
        }

        const elem = editorRef.current;
        if (pos) {
            elem.style.left = `${pos.x}px`;
            elem.style.top = `${pos.y}px`;

            debounce(() => {
                setPosition({
                    x: pos.x,
                    y: pos.y,
                })
            }, POSITION_SIZE_DEBOUNCE_MS);
        }

        if (size) {
            elem.style.width = `${size.width}px`;
            elem.style.height = `${size.height}px`;

            // set debounced limits
            debounce(() => {
                setSize({
                    width: size.width,
                    height: size.width,
                })
            }, POSITION_SIZE_DEBOUNCE_MS);
        }

        elem.style.cursor = dragging ? 'grabbing' : 'default';
    }

    return (
        <div
            ref={editorRef}
            className="fixed z-[1000] bg-background border rounded-lg shadow-lg overflow-hidden"
        >
            <div
                className="flex items-center justify-between p-2 border-b sticky top-0 bg-background cursor-grab"
                onMouseDown={handleDragMouseDown}
            >
                <span className="font-medium capitalize text-sm my-0 px-2">{component.type} Settings</span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {

                            // add a minimized tab
                            addTab(component)

                            // close the editor
                            onClose();
                        }}
                        className="h-8 w-8"
                    >
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDock}
                        className="h-8 w-8"
                    >
                        <PictureInPicture className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="p-4 overflow-auto" style={{ height: `calc(100% - ${HEADER_HEIGHT}px)` }}>
                <PropInputs
                    propsDescriptorRoot={component.propsDescriptorRoot}
                    props={component.props}
                    onChange={(newProps) => {
                        component.update(newProps);
                        onChange();
                    }}
                />
                {"children" in component && (
                    <ComponentInput
                        parent={component}
                        onChange={onChange} />
                )}
            </div>

            {/* Resize handle */}
            <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onMouseDown={handleResizeMouseDown}
                style={{
                    background: 'linear-gradient(135deg, transparent 50%, hsl(var(--border)) 50%)',
                }}
            />
        </div>
    );
}
