"use client";

import { HeaderProps } from "./types";

const defaultProps: HeaderProps = {
  title: "Your Name",
  links: [
    { text: "About", url: "#about" },
    { text: "Projects", url: "#projects" },
    { text: "Contact", url: "#contact" }
  ]
};

export function Header({ title = defaultProps.title, links = defaultProps.links }: Partial<HeaderProps>) {
  return (
    <header className="w-full py-6 px-8 bg-background border-b">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <nav className="space-x-6">
          {links.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.text}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}