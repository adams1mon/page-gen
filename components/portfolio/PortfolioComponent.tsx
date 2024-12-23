import { Button } from "@/components/ui/button";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { ReactNode, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ComponentConfig } from "@/lib/components/Component";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";

interface PortfolioComponentProps {
    component: ComponentConfig;
    index: number;
    onUpdate: (component: ComponentConfig) => void;
    moveComponent: (dragIndex: number, hoverIndex: number) => void;
    onDrop: (type: string, index: number) => void;
    onDelete: (id: string) => void;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

function capitalizeFirstChar(s: string): string {
    if (s.length <= 0) throw new Error("cannot capitalize string with length 0");
    return s[0].toUpperCase() + s.slice(1);
}

// TODO: proper types
function createInputs(props: any, onChange: (props: any) => void, key: string = ''): ReactNode {

    if (typeof props === "string") {
        // simple string editor
        return <div
            key={key}
            className="mt-4"
        >
            {
                key.length > 0 &&
                <label className="text-sm font-medium py-1">{capitalizeFirstChar(key)}</label>
            }
            {
                props.length > 40 ?
                    <Textarea
                        className="text-sm font-normal"
                        value={props}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                    />
                    :
                    <Input
                        value={props}
                        onChange={(e) => onChange(e.target.value)}
                        className="text-sm font-bold"
                    />
            }
        </div>
    }

    if (Array.isArray(props)) {

        return <Card
            key={key}
            className="w-full mt-4 p-2"
        >
            <div className="flex items-center justify-between">
                {
                    key.length > 0 &&
                    <label className="text-sm font-medium">{capitalizeFirstChar(key)}</label>
                }
                <Button
                    onClick={() => onChange([...props, props[props.length - 1]])}
                    variant="outline"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            </div>

            {props.map((p: any, i: number) =>

                <div
                    key={key + i}
                >
                    {
                        // wrap the onChange passed to the child so 
                        // when the child calls onChange it doesn't have
                        // to update the parent's props
                        createInputs(
                            p,
                            (partialProps) => onChange([...props.slice(0, i), partialProps, ...props.slice(i + 1)]),
                            key + " " + (i+1)
                        )
                    }
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onChange(props.filter((_, fi: number) => fi !== i))}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </Card>
    }

    if (typeof props === "number") {
        // simple number editor
        return <div
            key={key}
            className="mt-4"
        >
            {
                key.length > 0 &&
                <label className="text-sm font-medium">{capitalizeFirstChar(key)}</label>
            }
            <Input
                value={props}
                onChange={(e) => onChange(Number(e.target.value))}
                className="text-sm font-bold"
            />
        </div>
    }

    if (typeof props === "object") {
        return <Card
            key={key}
            className="w-full mt-4 p-2"
        >
            {
                key.length > 0 &&
                <label className="text-sm font-medium">{capitalizeFirstChar(key)}</label>
            }
            {
                Object.keys(props).map(k =>

                    // wrap the onChange passed to the child so 
                    // when the child calls onChange it doesn't have
                    // to update the parent's props,
                    // only it's part of the object
                    createInputs(
                        props[k],
                        (partialProps) => onChange({
                            ...props,
                            [k]: partialProps,
                        }),
                        k
                    )
                )
            }
        </Card>
    }
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

            <header className="w-full py-6 px-8 bg-background border-b">
                <div className="max-w-5xl mx-auto">
                    <div className="space-y-8">
                        <div className="space-y-2">

                            {/* 
                                iterate through all the props of the component configs
                                and create editor elements
                            */}
                            {createInputs(component.props, handleUpdate)}

                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
