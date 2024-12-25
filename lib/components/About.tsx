import { createElement } from "react";
import { ComponentConfig } from "./Component";
import { ComponentContainer } from "./ComponentContainer";
import { User } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

export const ABOUT_TYPE = "About";

export interface AboutProps {
    title: string;
    description: string[],
    imageUrl: string,
}

function Elem(props: AboutProps) {
    return (
        <section className="w-full py-20 bg-background">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-8">${props.title}</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div 
                  className="aspect-square rounded-lg bg-cover bg-center" 
                  style={{
                      backgroundImage: `url('${props.imageUrl}')`
                  }}>
              </div>
              <div className="space-y-4">
                ${props.description.map(paragraph =>
                    <p className="text-lg text-muted-foreground">${paragraph}</p>
                ).join('')}
              </div>
            </div>
          </div>
        </section>
    )
}

const comp = {
    type: ABOUT_TYPE,
    jsx: Elem,
};


const defaultAboutProps: AboutProps = {
    title: "About Me",
    description: [
        "I'm a creative professional with a passion for building beautiful and functional digital experiences. With expertise in design and development, I bring ideas to life through clean code and intuitive interfaces.",
        "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the community."
    ],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
};

console.log(renderToStaticMarkup(createElement(comp.jsx, defaultAboutProps)));

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

const icon = createElement(User, {className: "w-4 h-4"});

ComponentContainer.register(ABOUT_TYPE, createConfig, toHtml);

