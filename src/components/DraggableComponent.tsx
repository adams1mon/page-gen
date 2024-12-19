import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComponentRenderer } from './ComponentRenderer';
import { ComponentEditor } from './ComponentEditor';
import { Component } from '@/types';

interface DraggableComponentProps {
  component: Component;
  onUpdate: (component: Component) => void;
  onToggleLock: (id: string) => void;
}

export function DraggableComponent({
  component,
  onUpdate,
  onToggleLock,
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
      
      <div className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleLock(component.id)}
          aria-label={component.locked ? "Unlock component" : "Lock component"}
        >
          {component.locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Unlock className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="pt-12 sm:pt-8">
        {component.locked ? (
          <ComponentRenderer component={component} />
        ) : (
          <ComponentEditor component={component} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}