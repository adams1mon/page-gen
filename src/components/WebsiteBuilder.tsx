import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Download, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DraggableComponent } from './DraggableComponent';
import { Component, ComponentType } from '@/types';

const initialComponents: Component[] = [
  {
    id: '1',
    type: 'header',
    content: '',
    locked: false,
    props: {
      text: 'Welcome to my website',
      level: 1,
    },
  },
];

export function WebsiteBuilder() {
  const [components, setComponents] = useState<Component[]>(initialComponents);
  const [selectedType, setSelectedType] = useState<ComponentType>('header');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addComponent = () => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type: selectedType,
      content: '',
      locked: false,
      props: {},
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (updatedComponent: Component) => {
    setComponents(
      components.map((component) =>
        component.id === updatedComponent.id ? updatedComponent : component
      )
    );
  };

  const toggleLock = (id: string) => {
    setComponents(
      components.map((component) =>
        component.id === id
          ? { ...component, locked: !component.locked }
          : component
      )
    );
  };

  const generateHTML = () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
    <div class="max-w-4xl mx-auto px-4 py-8">
        ${components
          .map((component) => {
            switch (component.type) {
              case 'header':
                return `<h${component.props?.level || 1} class="text-4xl font-bold mb-4">${
                  component.props?.text
                }</h${component.props?.level || 1}>`;
              case 'markdown':
                return `<div class="prose">${marked(component.content)}</div>`;
              case 'link':
                return `<a href="${component.props?.url}" class="text-blue-600 hover:underline">${component.props?.text}</a>`;
              case 'image':
                return `<img src="${component.props?.src}" alt="${component.props?.alt}" class="max-w-full h-auto rounded-lg">`;
              case 'footer':
                return `<footer class="text-center text-gray-600 py-4">${component.content}</footer>`;
              default:
                return '';
            }
          })
          .join('\n')}
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <LayoutTemplate className="h-6 w-6" />
              <h1 className="text-xl sm:text-2xl font-bold">Website Builder</h1>
            </div>
            <Button onClick={generateHTML} variant="secondary" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Select value={selectedType} onValueChange={(value: ComponentType) => setSelectedType(value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select component type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addComponent} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </div>
          <div className="text-sm text-muted-foreground hidden sm:block">
            Drag components to reorder
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={components}
              strategy={verticalListSortingStrategy}
            >
              {components.map((component) => (
                <DraggableComponent
                  key={component.id}
                  component={component}
                  onUpdate={updateComponent}
                  onToggleLock={toggleLock}
                />
              ))}
            </SortableContext>
          </DndContext>

          {components.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              No components added yet. Start by adding a component from above.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}