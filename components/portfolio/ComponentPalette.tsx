"use client";

import { Card } from "@/components/ui/card";
import { useDrag } from "react-dnd";
import { Layout, User, Briefcase, Mail, FileText } from "lucide-react";

interface ComponentItem {
  type: string;
  icon: React.ReactNode;
  title: string;
}

const components: ComponentItem[] = [
  { type: "header", icon: <Layout className="w-4 h-4" />, title: "Header" },
  { type: "hero", icon: <Layout className="w-4 h-4" />, title: "Hero Section" },
  { type: "about", icon: <User className="w-4 h-4" />, title: "About Me" },
  { type: "projects", icon: <Briefcase className="w-4 h-4" />, title: "Projects" },
  { type: "markdown", icon: <FileText className="w-4 h-4" />, title: "Markdown" },
  { type: "footer", icon: <Mail className="w-4 h-4" />, title: "Footer" },
];

const DraggableComponent = ({ type, icon, title }: ComponentItem) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "portfolio-component",
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      <Card className="p-4 hover:bg-accent flex items-center gap-2 transition-colors">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </Card>
    </div>
  );
};

export function ComponentPalette() {
  return (
    <div className="w-64 bg-card border-r p-4 space-y-2">
      <h2 className="font-semibold mb-4">Components</h2>
      {components.map((component) => (
        <DraggableComponent key={component.type} {...component} />
      ))}
    </div>
  );
}