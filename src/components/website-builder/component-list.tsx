"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndProvider } from "./dnd-provider";
import { DraggableComponent } from "./draggable-component";
import { Component } from "@/types";

interface ComponentListProps {
    components: Component[];
    onDragEnd: (event: any) => void;
    onUpdate: (component: Component) => void;
}

export function ComponentList({
    components,
    onDragEnd,
    onUpdate,
}: ComponentListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="space-y-6">
            <DndProvider>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={components}
                        strategy={verticalListSortingStrategy}
                    >
                        {components.map((component) => (
                            <DraggableComponent
                                key={component.id}
                                component={component}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </DndProvider>

            {components.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No components added yet. Start by adding a component from above.
                </div>
            )}
        </div>
    );
}
