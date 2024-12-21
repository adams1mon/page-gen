"use client";

import { Button } from "@/components/ui/button";
import { ComponentConfig } from "./portfolio-components/types";
import { PortfolioComponentRenderer } from "./portfolio-components";
import { ComponentEditor } from "./editor/ComponentEditor";
import { Settings } from "lucide-react";
import { useState } from "react";

interface PortfolioComponentProps {
  component: ComponentConfig;
  onUpdate: (updatedComponent: ComponentConfig) => void;
}

export function PortfolioComponent({ component, onUpdate }: PortfolioComponentProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="group relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={() => setIsEditing(true)}
      >
        <Settings className="w-4 h-4" />
      </Button>

      <PortfolioComponentRenderer component={component} />

      <ComponentEditor
        component={component}
        onUpdate={onUpdate}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
    </div>
  );
}
