"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { useEditorPreferences } from "@/lib/store/editor-preferences";
import { useState } from "react";

export function useComponentSelection() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentDescriptor | null>(null);
  const { isFloating, setIsFloating } = useEditorPreferences();

  const selectComponent = setSelectedComponent;

  const closeEditor = () => {
    setSelectedComponent(null);
  };

  const switchToFloating = () => {
    setIsFloating(true);
  };

  const switchToDocked = () => {
    setIsFloating(false);
  };

  return {
    selectedComponent,
    isFloating,
    selectComponent,
    closeEditor,
    switchToFloating,
    switchToDocked,
  };
}
