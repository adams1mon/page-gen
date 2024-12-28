import { renderToStaticMarkup } from "react-dom/server";
import { ComponentContainer, ComponentInstance } from "../components/ComponentContainer";
import { FunctionComponent, FunctionComponentElement, ReactNode, createElement } from "react";
import * as zip from "@zip.js/zip.js";
import { SITE_TYPE, SiteProps } from "./Site";
import styles from '!!raw-loader!./main.css';

export interface SiteConfig {
    title: string;
    description: string;
    components: ComponentInstance[];
}

export function newSiteConfig(components: ComponentInstance[] = []): SiteConfig {
    return {
        title: 'My Portfolio',
        description: 'Welcome to my portfolio website',
        components,
    }
}

function componentInstanceToNode(comp: ComponentInstance): FunctionComponentElement<any> {
    const { jsxFunc } = ComponentContainer.getDescriptor(comp.type);
    // assign the 'id' of the component to the React 'key' prop
    return createElement(jsxFunc, { ...comp.props, key: comp.id });
}

function componentInstanceToHtml(comp: ComponentInstance): string {
    const elem = componentInstanceToNode(comp);
    return renderToStaticMarkup(elem);
}

export async function generateHtml(config: SiteConfig) {

    const siteInstance = ComponentContainer.createInstance(SITE_TYPE);

    const nodes = config.components.map(c => componentInstanceToNode(c));
    (siteInstance.props as SiteProps).reactNodes = nodes;

    //const site = componentInstanceToHtml(siteInstance);
    const siteNode = componentInstanceToNode(siteInstance);
    const html = renderToStaticMarkup(siteNode);

    return html;

    // get generated tailwind files from a CDN??

    // TODO: add tailwind via the tailwind cli,
    // TODO: add separate CSS files,
    // TODO: add separate JS files,

    // TODO: add dark mode,
    //const tailwindcss = `<script src="https://cdn.tailwindcss.com"></script>`;
    //const tailwindcss = `<script src="https://cdn.tailwindcss.com/3.4.16"></script>`;

    // fetch tailwind
    const link = `${window.location.origin}/main.css`;
    const res = await fetch(link);

    const tailwindString = await res.text();

    //console.log(tailwindString);
    //const cssName = "main.css";
    //const tailwindcss = `<link rel="stylesheet" href="${cssName}"/>`;

    // Add smooth scroll behavior script
    const smoothScrollScript = `
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href').substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                            // Update URL without triggering a scroll
                            history.pushState(null, '', '#' + targetId);
                        }
                    });
                });
            });
        </script>
    `;

    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta description="${config.description}">
            <title>${config.title}</title>
            <style>
                ${tailwindString}
            </style>
            ${smoothScrollScript}
        </head>
        <body>
            ${renderedComponents}
        </body>
    </html>`;
}

//export async function generateHtml(config: SiteConfig) {
//    const renderedComponents = config.components
//        .map(c => componentToHtml(c))
//        .join('\n');
//
//    // get generated tailwind files from a CDN??
//
//    // TODO: add tailwind via the tailwind cli,
//    // TODO: add separate CSS files,
//    // TODO: add separate JS files,
//
//    // TODO: add dark mode,
//    //const tailwindcss = `<script src="https://cdn.tailwindcss.com"></script>`;
//    //const tailwindcss = `<script src="https://cdn.tailwindcss.com/3.4.16"></script>`;
//
//    // fetch tailwind
//    const link = `${window.location.origin}/main.css`;
//    const res = await fetch(link);
//
//    const tailwindString = await res.text();
//
//    //console.log(tailwindString);
//    //const cssName = "main.css";
//    //const tailwindcss = `<link rel="stylesheet" href="${cssName}"/>`;
//
//    // Add smooth scroll behavior script
//    const smoothScrollScript = `
//        <script>
//            document.addEventListener('DOMContentLoaded', () => {
//                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//                    anchor.addEventListener('click', function (e) {
//                        e.preventDefault();
//                        const targetId = this.getAttribute('href').substring(1);
//                        const targetElement = document.getElementById(targetId);
//                        if (targetElement) {
//                            targetElement.scrollIntoView({ behavior: 'smooth' });
//                            // Update URL without triggering a scroll
//                            history.pushState(null, '', '#' + targetId);
//                        }
//                    });
//                });
//            });
//        </script>
//    `;
//
//    return `<!DOCTYPE html>
//    <html lang="en">
//        <head>
//            <meta charset="UTF-8">
//            <meta name="viewport" content="width=device-width, initial-scale=1.0">
//            <meta description="${config.description}">
//            <title>${config.title}</title>
//            <style>
//                ${tailwindString}
//            </style>
//            ${smoothScrollScript}
//        </head>
//        <body>
//            ${renderedComponents}
//        </body>
//    </html>`;
//}

export async function generateZip(config: SiteConfig) {
    const renderedComponents = config.components
        .map(c => componentInstanceToHtml(c))
        .join('\n');

    // get generated tailwind files from a CDN??

    // TODO: add tailwind via the tailwind cli,
    // TODO: add separate CSS files,
    // TODO: add separate JS files,

    // TODO: add dark mode,
    //const tailwindcss = `<script src="https://cdn.tailwindcss.com"></script>`;
    //const tailwindcss = `<script src="https://cdn.tailwindcss.com/3.4.16"></script>`;

    // fetch tailwind
    const link = `${window.location.origin}/main.css`;
    const res = await fetch(link);
    const cssBlob = await res.blob();

    console.log(cssBlob);
    const cssName = "main.css";
    const tailwindcss = `<link rel="stylesheet" src="${cssName}"/>`;

    // Add smooth scroll behavior script
    const smoothScrollScript = `
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href').substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                            // Update URL without triggering a scroll
                            history.pushState(null, '', '#' + targetId);
                        }
                    });
                });
            });
        </script>
    `;

    const html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta description="${config.description}">
            <title>${config.title}</title>
            ${tailwindcss}
            ${smoothScrollScript}
        </head>
        <body>
            ${renderedComponents}
        </body>
    </html>`;


    //const README_URL = "https://unpkg.com/@zip.js/zip.js/README.md";
    return await getZipFileBlob();
    //.then(downloadFile);

    async function getZipFileBlob() {
        const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
        await Promise.all([
            //zipWriter.add(cssName, new zip.TextReader(tailwindString)),
            zipWriter.add(cssName, new zip.HttpReader(link)),
        ]);
        return zipWriter.close();
    }

    //function downloadFile(blob: any) {
    //    document.body.appendChild(Object.assign(document.createElement("a"), {
    //        download: "site.zip",
    //        href: URL.createObjectURL(blob),
    //        textContent: "Download zip file",
    //    }));
    //}
}

//function generateStyles() {
//    return `
//    /* Reset */
//    *, *::before, *::after {
//      box-sizing: border-box;
//      margin: 0;
//      padding: 0;
//    }
//
//    /* Variables */
//    :root {
//      --background: 0 0% 100%;
//      --foreground: 0 0% 3.9%;
//      --muted: 0 0% 96.1%;
//      --muted-foreground: 0 0% 45.1%;
//      --border: 0 0% 89.8%;
//      --accent: 0 0% 96.1%;
//      --primary: 0 0% 9%;
//      --primary-foreground: 0 0% 98%;
//    }
//
//    /* Base */
//    body {
//      margin: 0;
//      font-family: system-ui, -apple-system, sans-serif;
//      background: hsl(var(--background));
//      color: hsl(var(--foreground));
//      line-height: 1.5;
//      scroll-behavior: smooth;
//    }
//
//    /* Typography */
//    h1, h2, h3 { line-height: 1.2; }
//    h1 { font-size: 2.5rem; }
//    h2 { font-size: 2rem; }
//    h3 { font-size: 1.5rem; }
//    p { margin-bottom: 1rem; }
//
//    /* Layout */
//    .max-w-5xl { max-width: 64rem; }
//    .mx-auto { margin-left: auto; margin-right: auto; }
//    .px-8 { padding-left: 2rem; padding-right: 2rem; }
//    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
//    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
//    .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
//    .mb-2 { margin-bottom: 0.5rem; }
//    .mb-4 { margin-bottom: 1rem; }
//    .mb-6 { margin-bottom: 1.5rem; }
//    .mb-8 { margin-bottom: 2rem; }
//    .mb-12 { margin-bottom: 3rem; }
//
//    /* Grid */
//    .grid { display: grid; }
//    .gap-8 { gap: 2rem; }
//    .items-center { align-items: center; }
//
//    @media (min-width: 768px) {
//      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//    }
//
//    @media (min-width: 1024px) {
//      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//    }
//
//    /* Components */
//    .aspect-square { aspect-ratio: 1 / 1; }
//    .aspect-video { aspect-ratio: 16 / 9; }
//    .rounded-lg { border-radius: 0.5rem; }
//    .bg-cover { background-size: cover; }
//    .bg-center { background-position: center; }
//    .overflow-hidden { overflow: hidden; }
//
//    /* Colors */
//    .bg-background { background-color: hsl(var(--background)); }
//    .text-muted-foreground { color: hsl(var(--muted-foreground)); }
//    .border-t { border-top: 1px solid hsl(var(--border)); }
//    .bg-accent { background-color: hsl(var(--accent)); }
//
//    /* Links */
//    a {
//      color: hsl(var(--primary));
//      text-decoration: none;
//    }
//    a:hover {
//      text-decoration: underline;
//    }
//
//    /* Prose */
//    .prose {
//      max-width: 65ch;
//      color: hsl(var(--foreground));
//    }
//    .prose a { color: hsl(var(--primary)); }
//    .prose p { margin-bottom: 1.5em; }
//    .prose h1 { font-size: 2.5em; margin: 0 0 0.8em; }
//    .prose h2 { font-size: 1.75em; margin: 1.5em 0 0.8em; }
//    .prose h3 { font-size: 1.25em; margin: 1.5em 0 0.8em; }
//    .prose ul, .prose ol { margin: 1.5em 0; padding-left: 2em; }
//    .prose li { margin: 0.5em 0; }
//    .prose blockquote {
//      border-left: 0.25em solid hsl(var(--border));
//      padding-left: 1em;
//      font-style: italic;
//    }
//    .prose code {
//      background: hsl(var(--muted));
//      padding: 0.2em 0.4em;
//      border-radius: 0.25em;
//      font-size: 0.9em;
//    }
//    .prose pre {
//      background: hsl(var(--muted));
//      padding: 1em;
//      border-radius: 0.5em;
//      overflow-x: auto;
//    }
//  `;
//}

