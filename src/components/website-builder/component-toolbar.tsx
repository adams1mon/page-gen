import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentType } from "@/types";

interface ComponentToolbarProps {
  selectedType: ComponentType;
  onTypeChange: (type: ComponentType) => void;
  onAdd: () => void;
}

export function ComponentToolbar({
  selectedType,
  onTypeChange,
  onAdd,
}: ComponentToolbarProps) {
  return (
    <div className="mb-8 flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex items-center space-x-4">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[200px]">
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
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Component
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Drag components to reorder
      </div>
    </div>
  );
}