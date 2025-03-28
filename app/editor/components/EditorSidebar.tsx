import { PictureInPicture2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropInputs } from "@/components/component-editor/prop-editor/PropInputs";
import { ComponentInput } from "@/components/component-editor/component-input/ComponentInput";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { Page } from "@/lib/core/page/Page";
import { useEditorTabs } from "@/lib/store/editor-tabs-store";

interface EditorSidebarProps {
    component: ComponentNode | Page;
    onChange: () => void;
    onPopOut: () => void;
    onClose: () => void;
}

export function EditorSidebar({
    component,
    onChange,
    onPopOut,
    onClose,
}: EditorSidebarProps) {
    const { addTab } = useEditorTabs();

    return (
        <div className="h-full overflow-y-auto border-l bg-background">
            <div className="p-4 border-b sticky top-0 bg-background z-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold capitalize">
                        {component.type}
                    </h2>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {

                                // add a minimized tab
                                addTab(component)

                                // close the editor
                                onClose();
                            }}
                            className="h-8 w-8"
                        >
                            <Minimize2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onPopOut}
                            className="h-8 w-8"
                        >
                            <PictureInPicture2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="mt-4">
                    <PropInputs
                        component={component}
                        onChange={(newProps) => {
                            component.update(newProps);
                            onChange();
                        }}
                    />

                    {"children" in component && (
                        <ComponentInput
                            parent={component}
                            onChange={onChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
