"use client";

import { Button } from "@/components/ui/button";
import { ComponentInput } from "@/components/component-editor/component-input/ComponentInput";
import { PropInputs } from "@/components/component-editor/prop-editor/PropInputs";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { PictureInPicture2, X } from "lucide-react";

interface ComponentSettingsProps {
  component: ComponentDescriptor;
  onChange: (component: ComponentDescriptor) => void;
  onPopOut: () => void;
  onClose: () => void;
}

export function ComponentSettings({
  component,
  onChange,
  onPopOut,
  onClose,
}: ComponentSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {component.name} Settings
        </h2>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPopOut} 
            className="h-8 w-8"
          >
            <PictureInPicture2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <PropInputs
        propsDescriptor={component.propsDescriptor}
        props={component.props}
        onChange={(newProps) => onChange({
          ...component,
          props: newProps
        })}
      />
      
      {component.acceptsChildren && (
        <ComponentInput
          components={component.childrenDescriptors}
          onChange={(components) => onChange({
            ...component,
            childrenDescriptors: components
          })}
        />
      )}
    </div>
  );
}
