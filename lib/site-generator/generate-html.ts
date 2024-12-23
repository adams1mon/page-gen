import { ABOUT_TYPE } from "../components/About";
import { ComponentConfig, PropType } from "../components/Component";
import { HEADER_TYPE } from "../components/Header";
import { toHtml as headerHtml} from "../components/Header";
import { toHtml as aboutHtml} from "../components/About";



export interface SiteConfig {
    title: string;
    description: string;
    components: ComponentConfig[];
}

const generateHtmlMap: {[k: string]: (props: any) => string}  = {
    [HEADER_TYPE]: headerHtml,
    [ABOUT_TYPE]: aboutHtml,
};

function getComponentHtml(type: string, props: PropType) {
    const comp = generateHtmlMap[type];
    if (!comp) throw new Error(`${comp} doesn't have a toHtml function registered`);
    return comp(props)
}

export function generateHtml(config: SiteConfig) {

        const renderedComponents = config.components
            .map(c => getComponentHtml(c.type, c.props))
            .join('\n');

        const tailwindcss = `<script src="https://cdn.tailwindcss.com"></script>`;

        return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta description="${config.description}">
                <title>${config.title}</title>
                ${tailwindcss}
                <style>
                  ${generateStyles()}
                </style>
            </head>
            <body>
                ${renderedComponents}
            </body>
        </html>`;
}

// TODO: add an example to the components
//class Site {
//    config: SiteConfig = {
//        title: 'My Portfolio',
//        description: 'Welcome to my portfolio website',
//        components: [],
//    }
//
//    toHtml(): string {
//
//        const renderedComponents = this.config.components
//            .map(c => c.toHtml())
//            .join('\n');
//
//        const tailwindcss = `<script src="https://cdn.tailwindcss.com"></script>`;
//
//        return `<!DOCTYPE html>
//        <html lang="en">
//            <head>
//                <meta charset="UTF-8">
//                <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                <meta description="${this.config.description}">
//                <title>${this.config.title}</title>
//                ${tailwindcss}
//                <style>
//                  ${generateStyles()}
//                </style>
//            </head>
//            <body>
//                ${renderedComponents}
//            </body>
//        </html>`;
//    }
//};



//export function generateHtml(config: SiteConfig) {
//    const renderedComponents = config.components.map(component =>
//        renderComponent(component)
//    ).join('\n');
//
//    const tailwindcss = `
//        <script src="https://cdn.tailwindcss.com"></script>
//            <script type=text/javascript>alert("this is running") </script>
//    `;
//
//    return `<!DOCTYPE html>
//<html lang="en">
//<head>
//    <meta charset="UTF-8">
//    <meta name="viewport" content="width=device-width, initial-scale=1.0">
//    <meta description="${config.description}">
//    <title>${config.title}</title>
//    ${tailwindcss}
//    <style>
//      ${generateStyles()}
//    </style>
//</head>
//<body>
//    ${renderedComponents}
//</body>
//</html>`;
//}

function renderComponent(component: ComponentConfig): string {
    switch (component.type) {
        case 'header':
            return `
        <header class="w-full py-6 px-8 bg-background border-t">
          <div class="max-w-5xl mx-auto">
            <div class="flex justify-between items-center">
              <h1 class="text-2xl font-bold">${component.props.title}</h1>
              <nav class="space-x-6">
                ${component.props.links.map(link =>
                `<a href="${link.url}" class="text-muted-foreground hover:text-foreground">
                    ${link.text}
                  </a>`
            ).join('')}
              </nav>
            </div>
          </div>
        </header>`;

        case 'hero':
            return `
        <section class="w-full min-h-[500px] relative flex items-center">
          ${component.props.backgroundType === 'video'
                    ? `<video autoplay muted loop class="absolute inset-0 w-full h-full object-cover">
                <source src="${component.props.backgroundUrl}" type="video/mp4">
              </video>`
                    : `<div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${component.props.backgroundUrl}')"></div>`
                }
          <div class="relative z-10 max-w-5xl mx-auto px-8 py-20">
            <div class="bg-background/80 backdrop-blur-sm p-8 rounded-lg">
              <h1 class="text-5xl font-bold mb-6">${component.props.title}</h1>
              <p class="text-xl text-muted-foreground max-w-2xl">${component.props.subtitle}</p>
            </div>
          </div>
        </section>`;

        case 'about':
            return `
        <section class="w-full py-20 bg-background">
          <div class="max-w-5xl mx-auto px-8">
            <h2 class="text-3xl font-bold mb-8">${component.props.title}</h2>
            <div class="grid md:grid-cols-2 gap-12 items-center">
              <div class="aspect-square rounded-lg bg-cover bg-center" style="background-image: url('${component.props.imageUrl}')"></div>
              <div class="space-y-4">
                ${component.props.description.map(paragraph =>
                `<p class="text-lg text-muted-foreground">${paragraph}</p>`
            ).join('')}
              </div>
            </div>
          </div>
        </section>`;

        case 'projects':
            return `
        <section class="w-full py-20 bg-accent">
          <div class="max-w-5xl mx-auto px-8">
            <h2 class="text-3xl font-bold mb-12">${component.props.title}</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${component.props.projects.map(project => `
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

        case 'markdown':
            // Note: For production, you'd want to use a markdown parser here
            return `
        <section class="w-full py-12 bg-background">
          <div class="max-w-5xl mx-auto px-8">
            <h2 class="text-2xl font-bold mb-6">${component.props.title}</h2>
            <div class="prose">
              ${component.props.content}
            </div>
          </div>
        </section>`;

        case 'footer':
            return `
        <footer class="w-full py-12 bg-background border-t">
          <div class="max-w-5xl mx-auto px-8">
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">Contact</h3>
                <p class="text-muted-foreground">${component.props.email}</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-4">Social</h3>
                <div class="space-y-2">
                  ${component.props.socialLinks.map(link =>
                `<a href="${link.url}" class="block text-muted-foreground hover:text-foreground">
                      ${link.text}
                    </a>`
            ).join('')}
                </div>
              </div>
            </div>
          </div>
        </footer>`;

        default:
            return '';
    }
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
