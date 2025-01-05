"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { ComponentDescriptor } from '../components-meta/ComponentDescriptor';
import { ComponentContainer } from '../components-meta/ComponentContainer';

interface ComponentClipboardContextType {
  copiedComponent: ComponentDescriptor | null;
  copy: (component: ComponentDescriptor) => void;
  paste: () => ComponentDescriptor | null;
  hasCopiedComponent: () => boolean;
}

const ComponentClipboardContext = createContext<ComponentClipboardContextType | undefined>(undefined);

export function ComponentClipboardProvider({ children }: { children: ReactNode }) {
  const [copiedComponent, setCopiedComponent] = useState<ComponentDescriptor | null>(null);

  const value = {
    copiedComponent,
    copy: (component: ComponentDescriptor) => {
      setCopiedComponent(component);
    },
    paste: () => {
      return copiedComponent ? ComponentContainer.clone(copiedComponent) : null;
    },
    hasCopiedComponent: () => copiedComponent !== null,
  };

  return (
    <ComponentClipboardContext.Provider value={value}>
      {children}
    </ComponentClipboardContext.Provider>
  );
}

export function useComponentClipboard() {
  const context = useContext(ComponentClipboardContext);
  if (context === undefined) {
    throw new Error('useComponentClipboard must be used within a ComponentClipboardProvider');
  }
  return context;
}
