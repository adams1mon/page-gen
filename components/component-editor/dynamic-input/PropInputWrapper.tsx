"use client";

import { ReactNode, useState } from "react";
import { PropInputProvider } from "./PropInputContext";
import { PropBreadcrumbs } from "./PropBreadcrumbs";

interface PropPath {
  displayName: string;
}

interface PropInputWrapperProps {
  children: ReactNode;
}

export function PropInputWrapper({ children }: PropInputWrapperProps) {
  const [path, setPath] = useState<PropPath[]>([]);

  return (
    <PropInputProvider initialPath={path} onPathChange={setPath}>
      <div className="w-full max-w-2xl mx-auto">
        <PropBreadcrumbs />
        {children}
      </div>
    </PropInputProvider>
  );
}
