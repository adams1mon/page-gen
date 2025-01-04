"use client";

import { createContext, useContext } from "react";

interface PropPath {
  displayName: string;
}

interface PropInputContextType {
  path: PropPath[];
  addToPath: (item: PropPath) => void;
  removeFromPath: () => void;
}

const PropInputContext = createContext<PropInputContextType | null>(null);

export function usePropInputContext() {
  const context = useContext(PropInputContext);
  if (!context) {
    throw new Error("usePropInputContext must be used within a PropInputProvider");
  }
  return context;
}

export function PropInputProvider({ 
  children,
  initialPath = [],
  onPathChange,
}: { 
  children: React.ReactNode;
  initialPath?: PropPath[];
  onPathChange?: (path: PropPath[]) => void;
}) {
  const addToPath = (item: PropPath) => {
    const newPath = [...initialPath, item];
    console.log("new path", newPath);
    
    onPathChange?.(newPath);
  };

  const removeFromPath = () => {
    const newPath = initialPath.slice(0, -1);
    onPathChange?.(newPath);
  };

  return (
    <PropInputContext.Provider value={{ path: initialPath, addToPath, removeFromPath }}>
      {children}
    </PropInputContext.Provider>
  );
}
