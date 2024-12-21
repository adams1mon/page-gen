"use client";

import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Projects } from "./Projects";
import { Footer } from "./Footer";
import { ComponentConfig } from "./types";
import { Markdown } from "./Markdown";

const componentMap: Record<string, React.ComponentType<any>> = {
  header: Header,
  hero: Hero,
  about: About,
  markdown: Markdown,
  projects: Projects,
  footer: Footer,
};

interface PortfolioComponentRendererProps {
  component: ComponentConfig;
}

export function PortfolioComponentRenderer({ component }: PortfolioComponentRendererProps) {
  const Component = componentMap[component.type];
  if (!Component) return null;
  return <Component {...component.props} />;
}

export type { ComponentConfig };
