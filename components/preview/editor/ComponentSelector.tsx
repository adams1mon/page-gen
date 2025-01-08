"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";

interface ComponentSelectorProps extends React.PropsWithChildren {
    onInsert: (component: ComponentDescriptor) => void;
}

export function ComponentSelector({ onInsert, children }: ComponentSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="max-h-80 overflow-y-auto">
                {ComponentContainer.getAvailableComponents().map(component => (
                    <DropdownMenuItem
                        key={component.type}
                        onClick={() => onInsert(ComponentContainer.createInstance(component.type))}
                        className="flex items-center gap-2"
                    >
                        {component.icon}
                        <span>{component.type}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
