import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Component } from "@/types";

interface ComponentEditorProps {
  component: Component;
  onUpdate: (updatedComponent: Component) => void;
}

export function ComponentEditor({ component, onUpdate }: ComponentEditorProps) {
  const handleUpdate = (updates: Partial<Component>) => {
    onUpdate({
      ...component,
      ...updates,
    });
  };

  const renderEditor = () => {
    switch (component.type) {
      case "header":
        return (
          <div className="space-y-4">
            <Input
              value={component.props?.text || ""}
              onChange={(e) =>
                handleUpdate({
                  props: { ...component.props, text: e.target.value },
                })
              }
              placeholder="Header Text"
            />
            <Select
              value={String(component.props?.level || 1)}
              onValueChange={(value) =>
                handleUpdate({
                  props: { ...component.props, level: Number(value) },
                })
              }
            >
              <SelectTrigger>
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

      case "markdown":
        return (
          <Textarea
            value={component.content}
            onChange={(e) => handleUpdate({ content: e.target.value })}
            placeholder="Markdown Content"
            className="min-h-[200px]"
          />
        );

      case "link":
        return (
          <div className="space-y-4">
            <Input
              value={component.props?.text || ""}
              onChange={(e) =>
                handleUpdate({
                  props: { ...component.props, text: e.target.value },
                })
              }
              placeholder="Link Text"
            />
            <Input
              value={component.props?.url || ""}
              onChange={(e) =>
                handleUpdate({
                  props: { ...component.props, url: e.target.value },
                })
              }
              placeholder="URL"
            />
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <Input
              value={component.props?.src || ""}
              onChange={(e) =>
                handleUpdate({
                  props: { ...component.props, src: e.target.value },
                })
              }
              placeholder="Image URL"
            />
            <Input
              value={component.props?.alt || ""}
              onChange={(e) =>
                handleUpdate({
                  props: { ...component.props, alt: e.target.value },
                })
              }
              placeholder="Alt Text"
            />
          </div>
        );

      case "footer":
        return (
          <Textarea
            value={component.content}
            onChange={(e) => handleUpdate({ content: e.target.value })}
            placeholder="Footer Content"
            className="min-h-[100px]"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">{component.type}</div>
      {renderEditor()}
    </div>
  );
}