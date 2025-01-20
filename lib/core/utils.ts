import { FunctionComponent, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function tag(name: string, obj?: { [key: string]: string }) {
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

