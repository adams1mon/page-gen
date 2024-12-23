import { HeroProps, AboutProps, ProjectsProps, FooterProps, MarkdownProps } from "./types";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Markdown } from "./Markdown";
import { Projects } from "./Projects";
import { Footer } from "./Footer";
import { HEADER_TYPE, HeaderProps } from "@/lib/components/Header";
import { ABOUT_TYPE } from "@/lib/components/About";

const componentMap: Record<string, React.ComponentType<any>> = {
    [HEADER_TYPE]: Header,
  //hero: Hero,
  [ABOUT_TYPE]: About,
  //markdown: Markdown,
  //projects: Projects,
  //footer: Footer,
};

export function getReactElementByType(type: string) {
    const item = componentMap[type];
    if (!item) throw Error(`${item} is not a valid item`);
    return item;
}

export const defaultProps: {
  header: HeaderProps;
  hero: HeroProps;
  about: AboutProps;
  projects: ProjectsProps;
  footer: FooterProps;
  markdown: MarkdownProps;
} = {
  header: {
    title: "Your Name",
    links: [
      { text: "About", url: "#about" },
      { text: "Projects", url: "#projects" },
      { text: "Contact", url: "#contact" }
    ]
  },
  hero: {
    title: "Welcome to My Portfolio",
    subtitle: "I'm a passionate creator building amazing digital experiences. Explore my work and let's create something amazing together.",
    backgroundType: "image",
    backgroundUrl: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80"
  },
  about: {
    title: "About Me",
    description: [
      "I'm a creative professional with a passion for building beautiful and functional digital experiences. With expertise in design and development, I bring ideas to life through clean code and intuitive interfaces.",
      "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the community."
    ],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
  },
  projects: {
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
  },
  footer: {
    email: "email@example.com",
    socialLinks: [
      { text: "GitHub", url: "https://github.com" },
      { text: "LinkedIn", url: "https://linkedin.com" },
      { text: "Twitter", url: "https://twitter.com" }
    ]
  },
  markdown: {
    title: "Markdown Section",
    content: "# Hello World\n\nThis is a markdown section. You can write:\n\n- Lists\n- **Bold text**\n- *Italic text*\n\n## Code\n\n```js\nconsole.log('Hello World');\n```"
  }
};
