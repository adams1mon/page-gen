import { Link } from "./common";


export const HEADER_TYPE = "header";

export interface HeaderProps {
    title: string;
    links: Link[];
}

export const defaultHeaderProps = {
    title: "Your Name",
    links: [
        { text: "About", url: "#about" },
        { text: "Projects", url: "#projects" },
        { text: "Contact", url: "#contact" }
    ]
};

export function toHtml(props: HeaderProps) {
    return `
        <header class="w-full py-6 px-8 bg-background border-t">
          <div class="max-w-5xl mx-auto">
            <div class="flex justify-between items-center">
              <h1 class="text-2xl font-bold">${props.title}</h1>
              <nav class="space-x-6">
                ${props.links.map(link =>
                    `<a href="${link.url}" class="text-muted-foreground hover:text-foreground">
                    ${link.text}
                    </a>`
                ).join('')}
              </nav>
            </div>
          </div>
        </header>`;
};
