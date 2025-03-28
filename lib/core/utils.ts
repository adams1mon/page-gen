import { FunctionComponent, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// mostly used for creating component IDs
export function createId(type: string): string {
    return `${type}-${crypto.randomUUID()}`;
}

export function tag(name: string, obj?: { [key: string]: string }) {

    // TODO: make this build, enforce client side rendering somehow
    const m = document.createElement(name);
    for (const key in obj) {
        m.setAttribute(key, obj[key]);
    }
    return m;
}

export function createHtmlElementFromReact(jsx: FunctionComponent<any>, props: any): HTMLElement {
    // @ts-ignore
    const doc: Document = Document.parseHTMLUnsafe(
        renderToStaticMarkup(createElement(jsx, props))
    );

    return doc.querySelector("body *")!;
}

