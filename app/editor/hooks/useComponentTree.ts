"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { useState } from "react";

export function useComponentTree(initialTree: ComponentDescriptor) {
  const [tree, setTree] = useState<ComponentDescriptor>(initialTree);

  const updateComponent = (updatedComponent: ComponentDescriptor) => {
    const updateComponentInTree = (comp: ComponentDescriptor): ComponentDescriptor => {
      if (comp.id === updatedComponent.id) {
        return updatedComponent;
      }
      if (comp.acceptsChildren) {
        return {
          ...comp,
          childrenDescriptors: comp.childrenDescriptors.map(updateComponentInTree)
        };
      }
      return comp;
    };

    setTree(updateComponentInTree(tree));
  };

  return {
    tree,
    setTree,
    updateComponent,
  };
}