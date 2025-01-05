import { Button } from "@/components/ui/button";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { PropInputs } from "./dynamic-input/PropInputs";
import { useRef, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import { updateProps } from "@/lib/components-meta/ComponentContainer";
import { ComponentInput } from "./component-input/ComponentInput";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";

interface ComponentEditorProps {
    component: ComponentDescriptor;
    index: number;
    onUpdate: (component: ComponentDescriptor) => void;
    moveComponent: (dragIndex: number, hoverIndex: number) => void;
    onDelete: ((id: string) => void) | null;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

export function ComponentEditor({
    component,
    index,
    onUpdate,
    moveComponent,
    onDelete,
}: ComponentEditorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(true);

    const [, drop] = useDrop({
        accept: "portfolio-component-sort",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveComponent(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "portfolio-component-sort",
        item: () => ({ id: component.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.5 : 1;

    drag(dragHandleRef);
    drop(ref);

    const updateComponentProps = (newProps: any) => {
        onUpdate(updateProps(component, newProps))
    };

    const updateChildrenDescriptors = (descriptors: ComponentDescriptor[]) => {
        onUpdate({ ...component, childrenDescriptors: descriptors });
    };

    return (
        <div ref={ref} style={{ opacity }} className="group relative bg-background border rounded-lg">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between py-2 px-3 border-b cursor-pointer">
                        <div ref={dragHandleRef} className="cursor-move flex items-center gap-2 text-muted-foreground">
                            <GripVertical className="w-4 h-4" />
                            <span className="font-medium capitalize text-sm">{component.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {
                                onDelete != null &&
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(component.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            }
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isOpen ? "rotate-180" : ""
                                    )} />
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>

                    {/* prop inputs */}
                    <div className="p-4">
                        <PropInputs
                            propsDescriptor={component.propsDescriptor}
                            props={component.props}
                            onChange={updateComponentProps}
                        />
                    </div>

                    {/* children component inputs */}
                    {component.acceptsChildren &&
                        <div className="p-4">
                            <ComponentInput
                                components={component.childrenDescriptors}
                                onChange={updateChildrenDescriptors}
                            />
                        </div>
                    }

                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
