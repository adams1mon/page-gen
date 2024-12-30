"use client";

import { ComponentEditor } from "@/components/component-editor/ComponentEditor";

export default function NewComponentPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">Create Custom Component</h1>
        <ComponentEditor />
      </div>
    </div>
  );
}