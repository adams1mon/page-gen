import { ComponentContainer, ComponentDescriptor, NestedComponentsProps } from '../components/ComponentContainer';
import { DataType, ObjectDesc } from './PropsDescriptor';
import { titleDesc, longTextDesc, textDesc, urlDesc } from "./common";
import { nestComponents } from '../site-generator/generate-html';

export const SITE_TYPE = "Site";

export interface SiteProps extends NestedComponentsProps {
    title: string;
    description: string;
    tailwindCdn?: string;
    styles?: string;
    children: ComponentDescriptor[],
}

function Node(props: SiteProps) {

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={props.description} />
                {props.tailwindCdn && <script src={props.tailwindCdn}></script>}
                {props.styles && <style>{props.styles}</style>}
                <title>{props.title}</title>
            </head>
            <body>
                {nestComponents(props)}
            </body>
        </html>
    );
}

function generateStyles() {
    return `
    /* Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Variables */
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      --muted: 0 0% 96.1%;
      --muted-foreground: 0 0% 45.1%;
      --border: 0 0% 89.8%;
      --accent: 0 0% 96.1%;
      --primary: 0 0% 9%;
      --primary-foreground: 0 0% 98%;
    }

    /* Base */
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      line-height: 1.5;
      scroll-behavior: smooth;
    }

    /* Typography */
    h1, h2, h3 { line-height: 1.2; }
    h1 { font-size: 2.5rem; }
    h2 { font-size: 2rem; }
    h3 { font-size: 1.5rem; }
    p { margin-bottom: 1rem; }

    /* Layout */
    .max-w-5xl { max-width: 64rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-8 { padding-left: 2rem; padding-right: 2rem; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-12 { margin-bottom: 3rem; }

    /* Grid */
    .grid { display: grid; }
    .gap-8 { gap: 2rem; }
    .items-center { align-items: center; }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    /* Components */
    .aspect-square { aspect-ratio: 1 / 1; }
    .aspect-video { aspect-ratio: 16 / 9; }
    .rounded-lg { border-radius: 0.5rem; }
    .bg-cover { background-size: cover; }
    .bg-center { background-position: center; }
    .overflow-hidden { overflow: hidden; }

    /* Colors */
    .bg-background { background-color: hsl(var(--background)); }
    .text-muted-foreground { color: hsl(var(--muted-foreground)); }
    .border-t { border-top: 1px solid hsl(var(--border)); }
    .bg-accent { background-color: hsl(var(--accent)); }

    /* Links */
    a {
      color: hsl(var(--primary));
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    /* Prose */
    .prose {
      max-width: 65ch;
      color: hsl(var(--foreground));
    }
    .prose a { color: hsl(var(--primary)); }
    .prose p { margin-bottom: 1.5em; }
    .prose h1 { font-size: 2.5em; margin: 0 0 0.8em; }
    .prose h2 { font-size: 1.75em; margin: 1.5em 0 0.8em; }
    .prose h3 { font-size: 1.25em; margin: 1.5em 0 0.8em; }
    .prose ul, .prose ol { margin: 1.5em 0; padding-left: 2em; }
    .prose li { margin: 0.5em 0; }
    .prose blockquote {
      border-left: 0.25em solid hsl(var(--border));
      padding-left: 1em;
      font-style: italic;
    }
    .prose code {
      background: hsl(var(--muted));
      padding: 0.2em 0.4em;
      border-radius: 0.25em;
      font-size: 0.9em;
    }
    .prose pre {
      background: hsl(var(--muted));
      padding: 1em;
      border-radius: 0.5em;
      overflow-x: auto;
    }
  `;
}

const defaultProps: SiteProps = {
    title: 'My Portfolio',
    description: 'Welcome to my portfolio website',
    components: [],
    tailwindCdn: "https://cdn.tailwindcss.com/3.4.16",
    styles: generateStyles(),
    children: [],
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "About section Settings",
    child: {
        title: {
            ...titleDesc,
            desc: "Title of the website, displayed in the browser window.",
            default: "My Portfolio",
        },
        description: {
            ...textDesc,
            desc: "Description of the website, useful for Search Engine Optimization (SEO). Displayed in a <meta> tag.",
            default: "Personal portfolio website showcasing my projects",
        },
        components: {
            type: DataType.COMPONENT,
            displayName: "Components",
            desc: "Components which make up the website.",
        },
        tailwindCdn: {
            ...urlDesc,
            displayName: "Tailwind CDN URL",
            desc: "URL of the Tailwind CSS CDN, required for the styling of most components.",
            default: "https://cdn.tailwindcss.com/3.4.16",
        },
        styles: {
            ...longTextDesc,
            displayName: "Custom CSS styles",
            desc: "Custom CSS styles to include in a <style> in the website",
            default: generateStyles(),
        },
    }
};

const desc: ComponentDescriptor = {
    id: "site-id",
    type: SITE_TYPE,
    name: "Site",
    props: defaultProps,
    propsDescriptor,
    icon: null,
    jsxFunc: Node,
}

ComponentContainer.register(SITE_TYPE, desc);

