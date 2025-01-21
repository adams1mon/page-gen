// Import the Tailwind generated styles
// @ts-ignore
import css from '!!raw-loader!./styles/generated/styles.css';
import { titleDesc, textDesc, longTextDesc } from '../props/common';
import { ChildrenContainer } from '../types';
import { DataType, ObjectDesc, PropsDesc } from '../props/PropsDescriptor';
import { ComponentNode } from '../ComponentWrapper';
import { addChild, createId, findByIdInComp, removeChild } from '../tree-actions';
import { tag } from '../utils';

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

export class Page implements ChildrenContainer{

    type: string = "Page";
    propsDescriptor: PropsDesc = propsDescriptor;

    id: string;
    props: PageProps;

    htmlRoot: HTMLElement;
    htmlElement: HTMLElement;

    children: ComponentNode<any>[] = [];

    constructor(
        props: PageProps = defaultProps,
        html?: HTMLElement,
        domNode?: HTMLElement,
    ) {
        this.id = createId(this.type);
        this.props = props;
        this.htmlRoot = html ?? this.createHtml();
        this.htmlElement = domNode ?? this.htmlRoot.querySelector("body")!;
    }

    createHtml(): HTMLElement {
        const html = tag("html");

        const head = tag("head", { lang: "en" });
        head.appendChild(tag("meta", { charset: "UTF-8" }));
        head.appendChild(tag("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }));
        head.appendChild(tag("meta", { name: "description", content: this.props.description }));

        const title = tag("title");
        title.textContent = this.props.title;
        head.appendChild(title);

        const styles = tag("style");
        styles.textContent = this.props.styles ?? css;
        head.appendChild(styles);

        html.appendChild(head);

        const body = tag("body");
        html.appendChild(body);

        // render the children
        if (this.children) {
            for (const child of this.children) {
                body.appendChild(child.htmlElement);
            }
        }

        return html;
    }

    update(props: PageProps) {
        this.props = props;
        const newNode = this.createHtml();
        this.htmlRoot.replaceWith(newNode);
        this.htmlRoot = newNode;
        this.htmlElement = this.htmlRoot.querySelector("body")!;
        return this.htmlRoot;
    }

    clone(): Page {
        const page = new Page(this.props, this.htmlRoot, this.htmlElement);
        page.children = this.children;
        return page;
    }

    addChild(child: ComponentNode<any>, index?: number) {
        addChild(this, child, index);
    }

    removeChild(child: ComponentNode<any>) {
        removeChild(this, child);
    }

    findChildById(id: string): ComponentNode<any> | null {
        for (const child of this.children) {
            const node = findByIdInComp(child, id);
            if (node) return node;
        }

        return null;
    }

    toString(): string {
        return `Component: ${this.type}`;
    }
}

export function newPage() {
    return new Page();
}
