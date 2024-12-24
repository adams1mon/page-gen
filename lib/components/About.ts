import { ComponentConfig } from "./Component";
import { ComponentContainer } from "./ComponentContainer";

export const ABOUT_TYPE = "about";

export interface AboutProps {
    title: string;
    description: string[],
    imageUrl: string,
}

const defaultAboutProps: AboutProps = {
    title: "About Me",
    description: [
        "I'm a creative professional with a passion for building beautiful and functional digital experiences. With expertise in design and development, I bring ideas to life through clean code and intuitive interfaces.",
        "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the community."
    ],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
};

function toHtml(props: AboutProps) {
    return `
        <section class="w-full py-20 bg-background">
          <div class="max-w-5xl mx-auto px-8">
            <h2 class="text-3xl font-bold mb-8">${props.title}</h2>
            <div class="grid md:grid-cols-2 gap-12 items-center">
              <div class="aspect-square rounded-lg bg-cover bg-center" style="background-image: url('${props.imageUrl}')"></div>
              <div class="space-y-4">
                ${props.description.map(paragraph =>
        `<p class="text-lg text-muted-foreground">${paragraph}</p>`
    ).join('')}
              </div>
            </div>
          </div>
        </section>`;
};

function createConfig(): ComponentConfig {
    return {
        id: `${ABOUT_TYPE}-${Date.now()}`,
        type: ABOUT_TYPE,
        props: defaultAboutProps,
    }
}

ComponentContainer.register(ABOUT_TYPE, createConfig, toHtml);

