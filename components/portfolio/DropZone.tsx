"use client";

import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { PortfolioComponent } from "./portfolio-components";

interface DropZoneProps {
  onDrop: (type: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function DropZone({ onDrop, children, className }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "portfolio-component",
    drop: (item: { type: string }) => onDrop(item.type),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        "min-h-[200px] w-full rounded-lg border-2 border-dashed transition-colors",
        isOver ? "border-primary bg-accent/50" : "border-border",
        className
      )}
    >
      {children}
    </div>
  );
}