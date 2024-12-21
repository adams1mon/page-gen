"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ComponentPalette } from "@/components/portfolio/ComponentPalette";
import { DropZone } from "@/components/portfolio/DropZone";
import { ComponentConfig } from "@/components/portfolio/portfolio-components";
import { PortfolioComponent } from "@/components/portfolio/PortfolioComponent";
import { defaultProps } from "@/components/portfolio/portfolio-components/defaults";
import { useState } from "react";

export default function Home() {
  const [components, setComponents] = useState<ComponentConfig[]>([]);

  const handleDrop = (type: string) => {
    const newComponent: ComponentConfig = {
      id: `${type}-${Date.now()}`,
      type,
      props: defaultProps[type as keyof typeof defaultProps]
    };
    setComponents([...components, newComponent]);
  };

  const handleComponentUpdate = (updatedComponent: ComponentConfig) => {
    setComponents(components.map(component =>
      component.id === updatedComponent.id ? updatedComponent : component
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen">
        <ComponentPalette />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Portfolio Builder</h1>
          <DropZone onDrop={handleDrop} className="mb-8">
            {components.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-muted-foreground">
                  Drag and drop components here to build your portfolio
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {components.map((component) => (
                  <PortfolioComponent
                    key={component.id}
                    component={component}
                    onUpdate={handleComponentUpdate}
                  />
                ))}
              </div>
            )}
          </DropZone>
        </main>
      </div>
    </DndProvider>
  );
}