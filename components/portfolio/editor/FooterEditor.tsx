"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FooterProps, Link } from "../portfolio-components/types";
import { Plus, Trash2 } from "lucide-react";

interface FooterEditorProps {
  value: FooterProps;
  onChange: (value: FooterProps) => void;
}

export function FooterEditor({ value, onChange }: FooterEditorProps) {
  const addLink = () => {
    onChange({
      ...value,
      socialLinks: [...value.socialLinks, { text: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    onChange({
      ...value,
      socialLinks: value.socialLinks.filter((_, i) => i !== index),
    });
  };

  const updateLink = (index: number, field: keyof Link, newValue: string) => {
    onChange({
      ...value,
      socialLinks: value.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: newValue } : link
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          type="email"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Social Links</label>
          <Button onClick={addLink} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {value.socialLinks.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Platform"
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