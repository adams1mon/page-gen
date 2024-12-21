"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeaderProps, Link } from "../portfolio-components/types";
import { Plus, Trash2 } from "lucide-react";

interface HeaderEditorProps {
  value: HeaderProps;
  onChange: (value: HeaderProps) => void;
}

export function HeaderEditor({ value, onChange }: HeaderEditorProps) {
  const addLink = () => {
    onChange({
      ...value,
      links: [...value.links, { text: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    onChange({
      ...value,
      links: value.links.filter((_, i) => i !== index),
    });
  };

  const updateLink = (index: number, field: keyof Link, newValue: string) => {
    onChange({
      ...value,
      links: value.links.map((link, i) =>
        i === index ? { ...link, [field]: newValue } : link
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Navigation Links</label>
          <Button onClick={addLink} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
        
        {value.links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Text"
              value={link.text}
              onChange={(e) => updateLink(index, "text", e.target.value)}
            />
            <Input
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}