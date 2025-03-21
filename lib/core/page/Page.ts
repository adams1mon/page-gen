// Import the Tailwind generated styles
// @ts-ignore
import css from '!!raw-loader!./styles/generated/styles.css';
import { titleDesc, textDesc, longTextDesc } from '../props/common';
import { ChildrenContainer } from '../types';
import { PropCategory, PropsDescriptorRoot } from "../props/PropsDescriptor";
import { ComponentNode, SerializedComponentNode } from '../ComponentWrapper';
import { tag, createId} from '../utils';
import { ComponentAddedEvent, ComponentRemovedEvent, EventDispatcher, EventType } from '../EventDispatcher';

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

const propsDescriptor: PropsDescriptorRoot = {
    descriptors: {
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
            category: PropCategory.STYLE, 
        },
    }
};

export interface PageArgs {
    id?: string,
    props?: PageProps,
    htmlRoot?: HTMLElement,
    bodyElement?: HTMLElement,
    children?: ComponentNode[],
}

export class Page implements ChildrenContainer {

    type: string = "Page";
    
    // TODO: can this be removed? it feels redundant, it's to 
    // have the same API as a ComponentNode
    componentName: string = "Page";
    propsDescriptorRoot: PropsDescriptorRoot = propsDescriptor;

    id: string;
    props: PageProps;

    htmlRoot: HTMLElement;
    htmlElement: HTMLElement;

    children: ComponentNode[] = [];

    constructor({
        id,
        props,
        htmlRoot,
        bodyElement,
        children,
    }: PageArgs) {
        this.id = id || createId(this.type);
        this.props = props || defaultProps;

        // children has to be set before calling the createHtml
        this.children = children || [];

        this.htmlRoot = htmlRoot || this.createHtml();
        this.htmlElement = bodyElement || this.htmlRoot.querySelector("body")!;
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
        styles.textContent = this.props.styles || css;
        head.appendChild(styles);

        html.appendChild(head);

        const body = tag("body");
        html.appendChild(body);

        // render the children
        if (this.children) {
            for (const child of this.children) {
                // be careful, don't accidentally only add the htmlElement of the child
                body.appendChild(child.wrapperDiv || child.htmlElement);
            }
        }

        return html;
    }

    update(props: PageProps) {

        console.log("update page called", props);
        
        this.props = props;
        const newNode = this.createHtml();
        this.htmlRoot.replaceWith(newNode);
        this.htmlRoot = newNode;
        this.htmlElement = this.htmlRoot.querySelector("body")!;
        return this.htmlRoot;
    }

    // shallow clone, basically to satisfy setState
    clone(): Page {
        const clone = new Page({
            props: this.props,
            htmlRoot: this.htmlRoot,
            bodyElement: this.htmlElement,
            children: this.children,
        });
        console.log("page cloned, method", clone);

        return clone;
    }

    addChild(child: ComponentNode, index?: number) {

        if (!this.children) return;
        
        // insert the wrapper directly if it's defined
        const elemToInsert = child.wrapperDiv || child.htmlElement;

        if (index && index > 0 && index < this.children.length) {
            console.log("inserting at index into page", index);
            
            let ref = this.children[index];
            const refNode = ref.wrapperDiv || ref.htmlElement;
            refNode.insertAdjacentElement("beforebegin", elemToInsert);
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
            this.htmlElement.appendChild(elemToInsert);
        }

        child.parent = this;

        EventDispatcher.publish(
            EventType.COMPONENT_ADDED,
            { parent: this, component: child } as ComponentAddedEvent,
        );
    }

    removeChild(child: ComponentNode) {
        if (!this.children) return;

        this.children = this.children.filter(c => c.id !== child.id);
        child.htmlElement.remove();

        EventDispatcher.publish(
            EventType.COMPONENT_REMOVED, 
            { parent: child.parent, component: child } as ComponentRemovedEvent,
        );
    }

    findChildById(id: string): ComponentNode | null {
        for (const child of this.children) {
            const node = child.findChildById(id);
            if (node) return node;
        }

        return null;
    }

    serialize(): SerializedPage {
        const s = {
            id: this.id,
            props: this.props,
            children: this.children.map(c => c.serialize()),
        }
        console.log("serialized page", s);
        return s;
    }

    getClonedHtml(): string {
        // clone doesn't clone the wrappers
        const elems = this.children.map(c => c.clone());

        const copy = new Page({
            props: this.props,
            children: elems,
        });
        
        return copy.htmlRoot.outerHTML;
    }

    toString(): string {
        return `Component: ${this.type}`;
    }
}

export interface SerializedPage {
    id: string;
    props: PageProps;
    children: SerializedComponentNode[];
}
