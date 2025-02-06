import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Clipboard } from "lucide-react";
import { ComponentSelector } from "./ComponentSelector";
import { useComponentClipboard } from "@/app/editor/hooks/useComponentClipboard";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { useComponentSelector } from "@/lib/store/component-selector-store";

interface ComponentDividerProps {
    onInsert: (component: ComponentNode<any>) => void;
}

export function ComponentDivider({ onInsert }: ComponentDividerProps) {
    const { hasCopiedComponent, paste } = useComponentClipboard();
    const { openComponentSelector } = useComponentSelector();

    return (
        <div className="relative h-8 flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center gap-x-2">
                <Button
                    variant="outline"
                    className="bg-background border-border"
                    onClick={() => openComponentSelector(onInsert)}
                >
                    <div className="flex gap-2 text-muted-foreground">
                        <Plus className="h-4 w-4" />
                        <span>Add component</span>
                    </div>
                </Button>

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

            <ComponentSelector />
        </div>
    );
}
