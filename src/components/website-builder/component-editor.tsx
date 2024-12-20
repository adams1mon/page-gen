import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Component } from '@/types';

interface ComponentEditorProps {
  component: Component;
  onUpdate: (updatedComponent: Component) => void;
}

export function ComponentEditor({ component, onUpdate }: ComponentEditorProps) {
  const [editedComponent, setEditedComponent] = useState(component);

  const handleUpdate = () => {
    onUpdate(editedComponent);
  };

  const renderEditor = () => {
    switch (component.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <Input
              value={editedComponent.props?.text || ''}
              onChange={(e) => setEditedComponent({
                ...editedComponent,
                props: { ...editedComponent.props, text: e.target.value }
              })}
              placeholder="Header Text"
              className="w-full"
            />
            <Select
              value={String(editedComponent.props?.level || 1)}
              onValueChange={(value) => setEditedComponent({
                ...editedComponent,
                props: { ...editedComponent.props, level: Number(value) }
              })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Header Level" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <SelectItem key={level} value={String(level)}>
                    H{level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'markdown':
        return (
          <Textarea
            value={editedComponent.content}
            onChange={(e) => setEditedComponent({
              ...editedComponent,
              content: e.target.value
            })}
            placeholder="Markdown Content"
            className="min-h-[200px] w-full"
          />
        );

      case 'link':
        return (
          <div className="space-y-4">
            <Input
              value={editedComponent.props?.text || ''}
              onChange={(e) => setEditedComponent({
                ...editedComponent,
                props: { ...editedComponent.props, text: e.target.value }
              })}
              placeholder="Link Text"
              className="w-full"
            />
            <Input
              value={editedComponent.props?.url || ''}
              onChange={(e) => setEditedComponent({
                ...editedComponent,
                props: { ...editedComponent.props, url: e.target.value }
              })}
              placeholder="URL"
              className="w-full"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <Input
              value={editedComponent.props?.src || ''}
              onChange={(e) => setEditedComponent({
                ...editedComponent,
                props: { ...editedComponent.props, src: e.target.value }
              })}
              placeholder="Image URL"
              className="w-full"
            />
            <Input
              value={editedComponent.props?.alt || ''}
              onChange={(e) => setEditedComponent({
                ...editedComponent,
                props: { ...editedComponent.props, alt: e.target.value }
              })}
              placeholder="Alt Text"
              className="w-full"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-background border rounded-lg">
      <h3 className="text-lg font-semibold">Edit {component.type}</h3>
      {renderEditor()}
      <div className="flex justify-end space-x-2">
        <Button onClick={handleUpdate} className="w-full sm:w-auto">Save Changes</Button>
      </div>
    </div>
  );
}
