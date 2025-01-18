import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { availableComponents } from "@/lib/newcomps/available-comps";
import { Component } from "@/lib/newcomps/types";

interface ComponentSelectorProps extends React.PropsWithChildren {
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
                    Object.keys(availableComponents).map(k => (

                    <DropdownMenuItem
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
