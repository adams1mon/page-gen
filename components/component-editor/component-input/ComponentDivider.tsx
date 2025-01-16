import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { Clipboard } from "lucide-react";
//import { useComponentClipboard } from '@/lib/store/component-clipboard-context';
import { ComponentSelector } from "./ComponentSelector";
import { Component } from "@/lib/newcomps/Heading";
import { useComponentClipboard } from "@/app/editor/hooks/useComponentClipboard";

interface ComponentDividerProps {
    //onInsert: (component: ComponentDescriptor) => void;
    onInsert: (component: Component) => void;
}

export function ComponentDivider({ onInsert }: ComponentDividerProps) {

    const { hasCopiedComponent, paste } = useComponentClipboard();

    return (
        <div className="relative h-8 flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center gap-x-2">

                <ComponentSelector onInsert={onInsert}>
                    <Button
                        variant="outline"
                        className="bg-background border-border"
                    >
                        <div className="flex gap-2 text-muted-foreground">
                            <Plus className="h-4 w-4" />
                            <span>Add component</span>
                        </div>
                    </Button>
                </ComponentSelector>

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

