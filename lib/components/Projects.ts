
export const PROJECTS_TYPE = "projects";

export interface Project {
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
}

export interface ProjectsProps {
    title: string;
    projects: Project[];
}

export const defaultProjectProps: ProjectsProps = {
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
        },
        {
            title: "Project 3",
            description: "An innovative solution that demonstrates problem-solving abilities.",
            imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80"
        }
    ]
};

export function toHtml(props: ProjectsProps) {
    return `
        <section class="w-full py-20 bg-accent">
          <div class="max-w-5xl mx-auto px-8">
            <h2 class="text-3xl font-bold mb-12">${props.title}</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${props.projects.map(project => `
                <div class="bg-background rounded-lg overflow-hidden">
                  <div class="aspect-video bg-cover bg-center" style="background-image: url('${project.imageUrl}')"></div>
                  <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
                    <p class="text-muted-foreground">${project.description}</p>
                    ${project.link ? `
                      <a href="${project.link}" class="text-primary hover:underline mt-4 inline-block">
                        Learn More →
                      </a>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;
};

