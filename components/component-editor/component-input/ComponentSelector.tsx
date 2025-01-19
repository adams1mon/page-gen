import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComponentRegistry } from "@/lib/newcomps/available-comps";
import { ComponentWrapper } from "@/lib/newcomps/types";

interface ComponentSelectorProps extends React.PropsWithChildren {
    onInsert: (component: ComponentWrapper) => void;
}

export function ComponentSelector({ onInsert, children }: ComponentSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="max-h-80 overflow-y-auto">
                {
                    Object.keys(ComponentRegistry.components).map(k => (

                    <DropdownMenuItem
                        key={k}
                        onClick={() => onInsert(ComponentRegistry.createInstance(k))}
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
