import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { Clipboard } from "lucide-react";
import { useComponentClipboard } from '@/lib/store/component-clipboard-context';

interface ComponentDividerProps {
    onInsert: (component: ComponentDescriptor) => void;
}

export function ComponentDivider({ onInsert }: ComponentDividerProps) {

    const { hasCopiedComponent, paste } = useComponentClipboard();

    return (
        <div className="relative h-8 flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative">

                <ComponentSelectorDropdown onInsert={onInsert}>
                    <Button
                        variant="outline"
                        className="bg-background border-border"
                    >
                        <div className="flex gap-2 text-muted-foreground">
                            <Plus className="h-4 w-4" />
                            <span>Add component</span>
                        </div>
                    </Button>
                </ComponentSelectorDropdown>

                {hasCopiedComponent() && (
                    <Button
                        variant="outline"
                        className="bg-background border-border"
                        onClick={() => {
                            const component = paste();
                            if (component) {
                                onInsert(component);
                            }
                        }}
                    >
                        <div className="flex gap-2 text-muted-foreground">
                            <Clipboard className="h-4 w-4" />
                            <span>Paste</span>
                        </div>
                    </Button>
                )}
            </div>
        </div>
    );
}

interface ComponentSelectorProps extends React.PropsWithChildren {
    onInsert: (component: ComponentDescriptor) => void;
}

export function ComponentSelectorDropdown({ onInsert, children }: ComponentSelectorProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="max-h-80 overflow-y-auto">
                {
                    ComponentContainer.getAvailableComponents().map(component => (
                        <DropdownMenuItem
                            key={component.type}
                            onClick={() => {
                                onInsert(ComponentContainer.createInstance(component.type))
                            }}
                            className="flex items-center gap-2"
                        >
                            {
                                component.icon
                            }
                            <span>{component.type}</span>
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

