"use client";

import { ComponentDivider } from "./ComponentDivider";
import { ComponentEditor } from "../ComponentEditor";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";


interface ComponentInputProps {
    components: ComponentDescriptor[];

    // called with the changed 'components', 
    // should set the updated components them on the parent component
    onChange: (components: ComponentDescriptor[]) => void;
};

// Slot for another component
export function ComponentInput(
    {
        components,
        onChange,
    }: ComponentInputProps
) {
    const [isOpen, setIsOpen] = useState(false);

    const addComponent = (component: ComponentDescriptor, index?: number) => {
        const newComponents = [...components];
        if (typeof index === 'number') {
            newComponents.splice(index, 0, component);
        }
        onChange(newComponents);
    };

    const handleComponentUpdate = (updatedComponent: ComponentDescriptor) => {
        const newComponents = components.map(component =>
            component.id === updatedComponent.id ? updatedComponent : component
        );
        onChange(newComponents);
    };

    const deleteComponent = (id: string) => {
        const newComponents = components.filter(component => component.id !== id)
        onChange(newComponents);
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

                <CollapsibleContent>
                    <div className="space-y-4">
                        {components.length === 0 ? (
                            <ComponentDivider onInsert={(comp) => addComponent(comp, 0)} />
                        ) : (
                            components.map((component, index) => (
                                <div key={component.id}>
                                    <ComponentDivider
                                        onInsert={(comp) => addComponent(comp, index)}
                                    />

                                    {/* Render the editors of the child components recursively */}
                                    <ComponentEditor
                                        component={component}
                                        onUpdate={handleComponentUpdate}
                                        onDelete={deleteComponent}
                                    />
                                    {index === components.length - 1 && (
                                        <ComponentDivider
                                            onInsert={(comp) => addComponent(comp, index + 1)}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible >
        </div >
    );
}
