"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeroProps } from "../portfolio-components/types";

interface HeroEditorProps {
  value: HeroProps;
  onChange: (value: HeroProps) => void;
}

export function HeroEditor({ value, onChange }: HeroEditorProps) {
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
        <label className="text-sm font-medium">Subtitle</label>
        <Textarea
          value={value.subtitle}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Background Type</label>
        <Select
          value={value.backgroundType}
          onValueChange={(newValue: 'image' | 'video') =>
            onChange({ ...value, backgroundType: newValue })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Background {value.backgroundType === 'image' ? 'Image' : 'Video'} URL
        </label>
        <Input
          value={value.backgroundUrl}
          onChange={(e) => onChange({ ...value, backgroundUrl: e.target.value })}
          placeholder={`Enter ${value.backgroundType} URL`}
        />
      </div>
    </div>
  );
}