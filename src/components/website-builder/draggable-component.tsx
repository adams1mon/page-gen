import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComponentEditor } from './component-editor';
import { Component } from '@/types';

interface DraggableComponentProps {
    component: Component;
    onUpdate: (component: Component) => void;
}

export function DraggableComponent({
    component,
    onUpdate,
}: DraggableComponentProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group bg-card rounded-lg shadow-sm border p-4"
        >
            <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4" />
                    <span className="sr-only">Drag to reorder</span>
                </Button>
            </div>

            <div className="pt-12 sm:pt-8">
                <ComponentEditor component={component} onUpdate={onUpdate} />
            </div>
        </div>
    );
}
