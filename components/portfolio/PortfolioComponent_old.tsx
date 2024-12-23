import { Button } from "@/components/ui/button";
import { ComponentConfig } from "./types";
import { GripVertical, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getReactElementByType } from "./defaults";

interface PortfolioComponentProps {
    component: ComponentConfig;
    index: number;
    onUpdate: (updatedComponent: ComponentConfig) => void;
    moveComponent: (dragIndex: number, hoverIndex: number) => void;
    onDrop: (type: string, index: number) => void;
    onDelete: (id: string) => void;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

export function PortfolioComponent({
    component,
    index,
    onUpdate,
    moveComponent,
    onDelete
}: PortfolioComponentProps) {
    const ref = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);

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

    const handleUpdate = (newProps: any) => {
        onUpdate({
            ...component,
            props: newProps
        });
    };

    const Node = getReactElementByType(component.type);

    return (
        <div ref={ref} style={{ opacity }} className="group relative bg-background border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <div ref={dragHandleRef} className="cursor-move flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    <span className="font-medium capitalize">{component.type}</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(component.id)}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <Node
                {...component.props}
                onChange={handleUpdate}
            />
        </div>
    );
}
