// Import the Tailwind generated styles
// @ts-ignore
import css from '!!raw-loader!../generated/styles.css';
import { tag } from '../site-generator/generate-html';
import { DataType, ObjectDesc, PropsDesc } from '../components-meta/PropsDescriptor';
import { titleDesc, textDesc, longTextDesc } from '../components/common';
import { Component } from './Heading';

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
    displayName: "Site settings",
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

//class Site {
//
//    id: string;
//    pages: Page[];
//
//    constructor(pages: Page[] = []) {
//        this.pages = pages;
//        this.id = createId("site");
//    }
//}

export function createId(type: string): string {
    return `${type}-${Date.now()}`;
}

export interface ChildrenContainer {
    children: Component[];
    isEmpty: () => boolean;
    addChild: (child: Component) => void;
    removeChild: (child: Component) => void;
    addSibling: (reference: Component, child: Component, position: 'before' | 'after') => void;
};


export class Page implements ChildrenContainer {

    static type: string = "Page";
    static propsDescriptor: PropsDesc = propsDescriptor;

    id: string;
    props: PageProps;

    children: Component[];

    htmlRoot: HTMLElement;

    constructor(props: PageProps = defaultProps, children: Component[] = [], html?: HTMLElement) {
        this.id = createId(Page.type);
        this.props = props;
        this.children = children;
        this.htmlRoot = html ?? this.createHtml(props);
    }

    createHtml(props: PageProps = defaultProps): HTMLElement {
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
        for (const child of this.children) {
            body.appendChild(child.domNode);
        }

        return html;
    }

    update(props: PageProps) {
        this.htmlRoot = this.createHtml(props);
        return this.htmlRoot;
    }

    clone() {
        return new Page(this.props, this.children, this.htmlRoot);
    }

    addChild(child: Component) {
        this.children.push(child);
        console.log("children", this.children);
        
        child.parent = this;
        this.htmlRoot = this.createHtml();
    }

    removeChild(child: Component) {
        this.children.filter(c => c.id !== child.id);
        this.createHtml();
    }

    // TODO:
    addSibling(reference: Component, child: Component, position: 'before' | 'after') {
        let index = this.children.findIndex(c => c.id == reference.id);

        if (position == 'before') {
            reference.domNode.insertAdjacentElement('beforebegin', child.domNode);
        } else if (position == 'after') {
            reference.domNode.insertAdjacentElement('afterend', child.domNode);

            if (index && index > -1) {
                index++;
            }
        }

        // update descriptors
        if (index !== undefined && index !== -1) {
            parent!.childrenDescriptors.splice(index, 0, child);
        }

        // update parent
        child.parent = reference.parent;

        console.log("DOM: added sibling", child, " to reference", reference);
    }

    isEmpty() {
        return this.children.length === 0;
    }

    findById(id: string, current?: Component): Component | null {
        if (current && current.id === id) return current;

        for (const child of this.children) {
            const node = this.findById(id, child);
            if (node) return node;
        }

        return null;
    }
}
