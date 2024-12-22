import { ProjectsProps } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const defaultProps: ProjectsProps = {
  title: "My Projects",
  projects: [
    {
      title: "Project 1",
      description: "A brief description of this amazing project and the technologies used.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
    },
    {
      title: "Project 2",
      description: "Another exciting project showcasing different skills and technologies.",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80"
    }
  ]
};

export function Projects({ 
  title = defaultProps.title,
  projects = defaultProps.projects,
  onChange
}: Partial<ProjectsProps> & { onChange?: (props: ProjectsProps) => void }) {
  if (!onChange) {
    return (
      <section className="w-full py-20 bg-accent">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-12">{title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-background rounded-lg overflow-hidden">
                <div 
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.imageUrl})` }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                  {project.link && (
                    <a href={project.link} className="text-primary hover:underline mt-4 inline-block">
                      Learn More →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-accent">
      <div className="max-w-5xl mx-auto px-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Title</label>
            <Input
              value={title}
              onChange={(e) => onChange({ title: e.target.value, projects })}
              className="text-3xl font-bold"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Projects</label>
              <Button
                onClick={() => onChange({
                  title,
                  projects: [...projects, { 
                    title: "New Project", 
                    description: "Project description",
                    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
                  }]
                })}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            {projects.map((project, index) => (
              <div key={index} className="space-y-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={project.title}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index] = { ...project, title: e.target.value };
                      onChange({ title, projects: newProjects });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index] = { ...project, description: e.target.value };
                      onChange({ title, projects: newProjects });
                    }}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={project.imageUrl}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index] = { ...project, imageUrl: e.target.value };
                      onChange({ title, projects: newProjects });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link (Optional)</label>
                  <Input
                    value={project.link || ""}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index] = { ...project, link: e.target.value };
                      onChange({ title, projects: newProjects });
                    }}
                    placeholder="https://"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange({
                    title,
                    projects: projects.filter((_, i) => i !== index)
                  })}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Project
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
