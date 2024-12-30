"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface PropsEditorProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}

export function PropsEditor({ value, onChange }: PropsEditorProps) {
  const [newPropName, setNewPropName] = useState("");

  const addProp = () => {
    if (newPropName) {
      onChange({ ...value, [newPropName]: "" });
      setNewPropName("");
    }
  };

  const removeProp = (key: string) => {
    const newProps = { ...value };
    delete newProps[key];
    onChange(newProps);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Default Props</label>
      
      <div className="space-y-2">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="flex gap-2">
            <Input
              value={key}
              onChange={(e) => {
                const newProps = { ...value };
                delete newProps[key];
                newProps[e.target.value] = val;
                onChange(newProps);
              }}
            />
            <Input
              value={val}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeProp(key)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="New prop name"
          value={newPropName}
          onChange={(e) => setNewPropName(e.target.value)}
        />
        <Button onClick={addProp}>
          <Plus className="h-4 w-4 mr-2" />
          Add Prop
        </Button>
      </div>
    </div>
  );
}
