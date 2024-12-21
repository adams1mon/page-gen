"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AboutProps } from "../portfolio-components/types";
import { Plus, Trash2 } from "lucide-react";

interface AboutEditorProps {
  value: AboutProps;
  onChange: (value: AboutProps) => void;
}

export function AboutEditor({ value, onChange }: AboutEditorProps) {
  const addParagraph = () => {
    onChange({
      ...value,
      description: [...value.description, ""],
    });
  };

  const removeParagraph = (index: number) => {
    onChange({
      ...value,
      description: value.description.filter((_, i) => i !== index),
    });
  };

  const updateParagraph = (index: number, newValue: string) => {
    onChange({
      ...value,
      description: value.description.map((p, i) =>
        i === index ? newValue : p
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Profile Image URL</label>
        <Input
          value={value.imageUrl}
          onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
          placeholder="Enter image URL"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Description</label>
          <Button onClick={addParagraph} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Paragraph
          </Button>
        </div>

        {value.description.map((paragraph, index) => (
          <div key={index} className="flex gap-2">
            <Textarea
              value={paragraph}
              onChange={(e) => updateParagraph(index, e.target.value)}
              rows={3}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeParagraph(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}