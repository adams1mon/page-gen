"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { useEditorPreferences } from "@/lib/store/editor-preferences";
import { useState } from "react";

export function useComponentSelection() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentDescriptor | null>(null);
  const { isFloating, setIsFloating } = useEditorPreferences();

  const selectComponent = (component: ComponentDescriptor) => {
    setSelectedComponent(component);
    if (!isFloating) {
      setShowSidebar(true);
    }
  };

  const closeEditor = () => {
    setSelectedComponent(null);
    setShowSidebar(false);
  };

  const toggleSidebar = () => {
    setSelectedComponent(null);
    setShowSidebar(!showSidebar);
  };

  const switchToFloating = () => {
    setIsFloating(true);
    setShowSidebar(false);
  };

  const switchToDocked = () => {
    setIsFloating(false);
    setShowSidebar(true);
  };

  return {
    showSidebar,
    selectedComponent,
    isFloating,
    selectComponent,
    closeEditor,
    toggleSidebar,
    switchToFloating,
    switchToDocked,
  };
}
