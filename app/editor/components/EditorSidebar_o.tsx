import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { PictureInPicture2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropInputs } from "@/components/component-editor/prop-editor/PropInputs";
import { ComponentInput } from "@/components/component-editor/component-input/ComponentInput";

interface EditorSidebarProps {
    component: ComponentDescriptor;
    onComponentUpdate: (component: ComponentDescriptor) => void;
    onPopOut: () => void;
    onClose: () => void;
}

export function EditorSidebar({
    component,
    onComponentUpdate,
    onPopOut,
    onClose,
}: EditorSidebarProps) {
    return (
        <div className="h-full overflow-y-auto border-l bg-background p-4">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold capitalize">
                        {component.name} Settings
                    </h2>
                    <div className="flex items-center gap-1">
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

                <PropInputs
                    propsDescriptor={component.propsDescriptor}
                    props={component.props}
                    onChange=
                    //onChange={(newProps) => onComponentUpdate({
                    //    ...component,
                    //    props: newProps
                    //})}
                />

                {component.acceptsChildren && (
                    <ComponentInput
                        components={component.childrenDescriptors}
                        onChange={(components) => onComponentUpdate({
                            ...component,
                            childrenDescriptors: components
                        })}
                    />
                )}
            </div>
        </div>
    );
}
