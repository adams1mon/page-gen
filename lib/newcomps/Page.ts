// Import the Tailwind generated styles
// @ts-ignore
import css from '!!raw-loader!../generated/styles.css';
import { tag } from '../site-generator/generate-html';
import { DataType, ObjectDesc, PropsDesc } from '../components-meta/PropsDescriptor';
import { titleDesc, textDesc, longTextDesc } from '../components/common';
import { addChild, addSibling, createId, findByIdInPage, removeChild, updateComp } from './utils';
import Heading from '../components/Heading';
import { Component, ComponentDesc } from './types';

// a single static webpage

// Properties
interface PageProps {
    title: string;
    description: string;
    styles: string;
};

const defaultProps: PageProps = {
    title: 'My Portfolio',
    description: 'Welcome to my portfolio',

    // NOTE: The site uses the same Tailwind generated CSS the main page uses.
    // The styles are overwritten by the generated Tailwind CSS file, 
    // see how a new site is created in generate-html.
    styles: css,
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Page settings",
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
        styles: {
            ...longTextDesc,
            displayName: "Custom CSS styles",
            desc: "Custom CSS styles to include in a <style> in the website",
            default: css,
        },
    }
};

export const pageDesc: ComponentDesc = {
    type: "Page",
    propsDescriptor,
    defaultProps,
    createHtmlElement,
};

export function createPage(): Component {
    const id = createId(pageDesc.type);
    const htmlElement = createHtmlElement(defaultProps);

    return {
        ...desc,
        id,
        defaultProps: props ?? desc.defaultProps,
        htmlElement,
        parent,
    };
}

function createHtmlElement(props: PageProps, children?: Component[]): HTMLElement {
    const html = tag("html");

    const head = tag("head", { lang: "en" });
    head.appendChild(tag("meta", { charset: "UTF-8" }));
    head.appendChild(tag("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }));
    head.appendChild(tag("meta", { name: "description", content: props.description }));

    const title = tag("title");
    title.textContent = props.title;
    head.appendChild(title);

    const styles = tag("style");
    styles.textContent = props.styles ?? css;
    head.appendChild(styles);

    html.appendChild(head);

    const body = tag("body");
    html.appendChild(body);

    // render the children
    if (children) {
        for (const child of children) {
            body.appendChild(child.htmlElement);
        }
    }

    return html;
}

//export interface ChildrenContainer {
//    domNode: HTMLElement;
//    children: Component[];
//    isEmpty: () => boolean;
//    addChild: (child: Component, index?: number) => void;
//    removeChild: (child: Component) => void;
//    findChildById: (id: string) => Component | null;
//};
//
//export class Page implements ChildrenContainer {
//
//    type: string = "Page";
//    propsDescriptor: PropsDesc = propsDescriptor;
//
//    id: string;
//    props: PageProps;
//
//    children: Component[];
//
//    htmlRoot: HTMLElement;
//    domNode: HTMLElement;
//
//    constructor(
//        props: PageProps = defaultProps,
//        children: Component[] = [],
//        html?: HTMLElement,
//        domNode?: HTMLElement,
//    ) {
//        this.id = createId(this.type);
//        this.children = children;
//        this.props = props;
//        this.htmlRoot = html ?? this.createHtml();
//        this.domNode = domNode ?? this.htmlRoot.querySelector("body")!;
//    }
//
//    createHtml(): HTMLElement {
//        const html = tag("html");
//
//        const head = tag("head", { lang: "en" });
//        head.appendChild(tag("meta", { charset: "UTF-8" }));
//        head.appendChild(tag("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }));
//        head.appendChild(tag("meta", { name: "description", content: this.props.description }));
//
//        const title = tag("title");
//        title.textContent = this.props.title;
//        head.appendChild(title);
//
//        const styles = tag("style");
//        styles.textContent = this.props.styles ?? css;
//        head.appendChild(styles);
//
//        html.appendChild(head);
//
//        const body = tag("body");
//        html.appendChild(body);
//
//        // render the children
//        for (const child of this.children) {
//            body.appendChild(child.htmlElement);
//        }
//
//        return html;
//    }
//
//    update(props: PageProps) {
//        this.props = props;
//        const newNode = this.createHtml();
//        this.htmlRoot.replaceWith(newNode);
//        this.htmlRoot = newNode;
//        this.domNode = this.htmlRoot.querySelector("body")!;
//        console.log("recreate page html");
//
//        return this.htmlRoot;
//    }
//
//    findChildById(id: string): Component | null {
//        return findByIdInPage(this, id);
//    }
//
//    clone(): Page {
//        return new Page(this.props, this.children, this.htmlRoot);
//    }
//
//    addChild(child: Component) {
//        addChild(this, child);
//    }
//
//    removeChild(child: Component) {
//        removeChild(this, child);
//    }
//
//    isEmpty() {
//        return this.children.length === 0;
//    }
//}
//
//
