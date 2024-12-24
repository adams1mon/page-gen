import { ComponentConfig } from "./Component";
import { ComponentContainer } from "./ComponentContainer";

export const HERO_TYPE = "hero";

export interface HeroProps {
    title: string;
    subtitle: string;
    backgroundType: string;
    backgroundUrl: string;
}

// TODO: create a descriptor for the props, so we can better create
// the editor interface and give <select> options too
// e.g. here image/video hero section shows up as a text input
// and we can also have better names for the fields

const defaultHeroProps = {
    title: "Welcome to My Portfolio",
    subtitle: "I'm a passionate creator building amazing digital experiences. Explore my work and let's create something amazing together.",
    backgroundType: "image",
    backgroundUrl: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80"
};

function toHtml(props: HeroProps) {
    return `
        <section class="w-full min-h-[500px] relative flex items-center">
          ${props.backgroundType === 'video'
            ? `<video autoplay muted loop class="absolute inset-0 w-full h-full object-cover">
                <source src="${props.backgroundUrl}" type="video/mp4">
              </video>`
            : `<div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${props.backgroundUrl}')"></div>`
          }
          <div class="relative z-10 max-w-5xl mx-auto px-8 py-20">
            <div class="bg-background/80 backdrop-blur-sm p-8 rounded-lg">
              <h1 class="text-5xl font-bold mb-6">${props.title}</h1>
              <p class="text-xl text-muted-foreground max-w-2xl">${props.subtitle}</p>
            </div>
          </div>
        </section>`;
};

function createConfig(): ComponentConfig {
    return {
        id: `${HERO_TYPE}-${Date.now()}`,
        type: HERO_TYPE,
        props: defaultHeroProps,
    }
}

ComponentContainer.register(HERO_TYPE, createConfig, toHtml);

