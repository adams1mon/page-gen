"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectsProps, Project } from "../portfolio-components/types";
import { Plus, Trash2 } from "lucide-react";

interface ProjectsEditorProps {
  value: ProjectsProps;
  onChange: (value: ProjectsProps) => void;
}

export function ProjectsEditor({ value, onChange }: ProjectsEditorProps) {
  const addProject = () => {
    onChange({
      ...value,
      projects: [
        ...value.projects,
        { title: "", description: "", imageUrl: "" },
      ],
    });
  };

  const removeProject = (index: number) => {
    onChange({
      ...value,
      projects: value.projects.filter((_, i) => i !== index),
    });
  };

  const updateProject = (index: number, field: keyof Project, newValue: string) => {
    onChange({
      ...value,
      projects: value.projects.map((project, i) =>
        i === index ? { ...project, [field]: newValue } : project
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Section Title</label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Projects</label>
          <Button onClick={addProject} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {value.projects.map((project, index) => (
          <div key={index} className="space-y-4 border rounded-lg p-4">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeProject(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={project.title}
                onChange={(e) => updateProject(index, "title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={project.imageUrl}
                onChange={(e) => updateProject(index, "imageUrl", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link (Optional)</label>
              <Input
                value={project.link || ""}
                onChange={(e) => updateProject(index, "link", e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}