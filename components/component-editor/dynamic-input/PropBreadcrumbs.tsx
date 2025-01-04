"use client";

import { ChevronRight } from "lucide-react";
import { usePropInputContext } from "./PropInputContext";

export function PropBreadcrumbs() {
  const { path } = usePropInputContext();

  if (path.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      {path.map((item, index) => (
        <div className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <span>{item.displayName}</span>
        </div>
      ))}
    </div>
  );
}
