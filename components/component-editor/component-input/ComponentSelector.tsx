import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { Component } from "@/lib/newcomps/Heading";
import { availableComponents } from "@/lib/newcomps/available-comps";

interface ComponentSelectorProps extends React.PropsWithChildren {
    //onInsert: (component: ComponentDescriptor) => void;
    onInsert: (component: Component) => void;
}

export function ComponentSelector({ onInsert, children }: ComponentSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="max-h-80 overflow-y-auto">
                {
                    //ComponentContainer.getAvailableComponents().map(component => (
                    Object.keys(availableComponents).map(k => (

                    <DropdownMenuItem
                        //key={component.type}
                        //onClick={() => onInsert(ComponentContainer.createInstance(component.type))}
                        key={k}
                        onClick={() => onInsert(availableComponents[k]())}
                        className="flex items-center gap-2"
                    >
                        {
                            //component.icon
                        //<span>{component.type}</span>
                        }
                        <span>{k}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
