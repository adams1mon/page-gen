"use client";

import { ComponentDivider } from "./ComponentDivider";
import { ComponentEditor } from "../ComponentEditor";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChildrenContainer } from "@/lib/core/types";
import { ComponentWrapper } from "@/lib/core/ComponentWrapper";


interface ComponentInputProps {
    parent: ChildrenContainer;

    // called with the changed 'components', 
    // should set the updated components them on the parent component
    onChange: () => void;
};

// Slot for another component
export function ComponentInput(
    {
        parent,
        onChange,
    }: ComponentInputProps
) {
    const [isOpen, setIsOpen] = useState(false);

    const addComponent = (component: ComponentWrapper<any>, index?: number) => {
        parent.addChild(component, index);
        onChange();
    };

    const deleteComponent = (component: ComponentWrapper<any>) => {
        parent.removeChild(component);
        onChange();
    };

    return (
        <div className="mt-2">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between border-b cursor-pointer pb-4">
                        <div>
                            <label className="text-sm font-medium py-1">Children</label>
                            <p className="text-sm text-muted-foreground my-0">Add or view the nested components of this element</p>
                        </div>

                        <Button variant="ghost" size="icon">
                            <ChevronDown className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isOpen ? "rotate-180" : ""
                            )} />
                        </Button>
                    </div>
                </CollapsibleTrigger>

                {parent && parent.children &&
                    <CollapsibleContent>
                        <div className="space-y-4">
                            {parent.children.length === 0 ? (
                                <ComponentDivider onInsert={(comp) => addComponent(comp, 0)} />
                            ) : (
                                parent.children.map((component, index) => (
                                    <div key={component.id}>
                                        <ComponentDivider
                                            onInsert={(comp) => addComponent(comp, index)}
                                        />

                                        {/* Render the editors of the child components recursively */}
                                        <ComponentEditor
                                            component={component}
                                            onChange={onChange}
                                            onDelete={() => deleteComponent(component)}
                                        />
                                        {
                                            index === parent.children!.length - 1 && (
                                                <ComponentDivider
                                                    onInsert={(comp) => addComponent(comp, index + 1)}
                                                />
                                            )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CollapsibleContent>
                }
            </Collapsible >
        </div >
    );
}
