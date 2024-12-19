"use client";

import { Header } from "./header";
import { ComponentList } from "./component-list";
import { ComponentToolbar } from "./component-toolbar";
import { useWebsiteBuilder } from "./use-website-builder";

export function WebsiteBuilder() {
  const {
    components,
    selectedType,
    setSelectedType,
    handleDragEnd,
    addComponent,
    updateComponent,
    generateHTML,
  } = useWebsiteBuilder();

  return (
    <div className="min-h-screen bg-background">
      <Header onExport={generateHTML} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <ComponentToolbar
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onAdd={addComponent}
        />
        <ComponentList
          components={components}
          onDragEnd={handleDragEnd}
          onUpdate={updateComponent}
        />
      </main>
    </div>
  );
}