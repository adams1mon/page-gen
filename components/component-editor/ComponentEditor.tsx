"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Trash2 } from "lucide-react";
import { PropInputs } from "./prop-editor/PropInputs";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useComponentClipboard } from "@/app/editor/hooks/useComponentClipboard";
import { ComponentInput } from "./component-input/ComponentInput";
import { ComponentWrapper } from "@/lib/core/ComponentWrapper";

interface ComponentEditorProps {
    component: ComponentWrapper<any>;
    onChange: () => void;
    onDelete: () => void | null;
}

export function ComponentEditor({
    component,
    onChange,
    onDelete,
}: ComponentEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { copy } = useComponentClipboard();

    return (
        <div className="group relative bg-background border rounded-lg">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between py-2 px-3 border-b cursor-pointer">
                        <div className="cursor-move flex items-center gap-2 text-muted-foreground">
                            <span className="font-medium capitalize text-sm">{component.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {
                                onDelete != null && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete();
                                            }}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copy(component);
                                            }}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </>
                                )
                            }
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isOpen ? "rotate-180" : ""
                                    )} />
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>

                    {/* prop inputs */}
                    <div className="p-4">
                        <PropInputs
                            propsDescriptor={component.propsDescriptor}
                            props={component.props}
                            onChange={(newProps) => {
                                component.update(newProps);
                                onChange();
                            }}
                        />
                    </div>

                    {/* children component inputs */}
                    {"children" in component &&
                        <div className="p-4">
                            <ComponentInput
                                parent={component}
                                onChange={onChange}
                            />
                        </div>
                    }

                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
