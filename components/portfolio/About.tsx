import { AboutProps } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const defaultProps: AboutProps = {
  title: "About Me",
  description: [
    "I'm a creative professional with a passion for building beautiful and functional digital experiences. With expertise in design and development, I bring ideas to life through clean code and intuitive interfaces.",
    "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the community."
  ],
  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
};

export function About({ 
  title = defaultProps.title,
  description = defaultProps.description,
  imageUrl = defaultProps.imageUrl,
  onChange
}: Partial<AboutProps> & { onChange?: (props: AboutProps) => void }) {
  if (!onChange) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              className="aspect-square rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="space-y-4">
              {description.map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-5xl mx-auto px-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => onChange({ title: e.target.value, description, imageUrl })}
              className="text-3xl font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => onChange({ title, description, imageUrl: e.target.value })}
              placeholder="Enter image URL"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Description</label>
              <Button 
                onClick={() => onChange({
                  title,
                  imageUrl,
                  description: [...description, ""]
                })}
                variant="outline" 
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Paragraph
              </Button>
            </div>

            {description.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={paragraph}
                  onChange={(e) => {
                    const newDescription = [...description];
                    newDescription[index] = e.target.value;
                    onChange({ title, description: newDescription, imageUrl });
                  }}
                  rows={3}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onChange({
                      title,
                      imageUrl,
                      description: description.filter((_, i) => i !== index)
                    });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
