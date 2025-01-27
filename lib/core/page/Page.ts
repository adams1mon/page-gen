// Import the Tailwind generated styles
// @ts-ignore
import css from '!!raw-loader!./styles/generated/styles.css';
import { titleDesc, textDesc, longTextDesc } from '../props/common';
import { ChildrenContainer } from '../types';
import { DataType, ObjectDesc, PropsDesc } from '../props/PropsDescriptor';
import { ComponentNode, SerializedComponentNode } from '../ComponentWrapper';
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

export interface PageArgs {
    id?: string,
    props?: PageProps,
    htmlRoot?: HTMLElement,
    bodyElement?: HTMLElement,
    children?: ComponentNode<any>[],
}

export class Page implements ChildrenContainer {

    type: string = "Page";
    propsDescriptor: PropsDesc = propsDescriptor;

    id: string;
    props: PageProps;

    htmlRoot: HTMLElement;
    htmlElement: HTMLElement;

    children: ComponentNode<any>[] = [];

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
                console.log("about to add child html", child.htmlElement);

                body.appendChild(child.htmlElement);
            }
        }

        return html;
    }

    update(props: PageProps) {
        // TODO: fix changing page props and calling update clears top-level editor wrapper divs
        this.props = props;
        const newNode = this.createHtml();
        this.htmlRoot.replaceWith(newNode);
        this.htmlRoot = newNode;
        this.htmlElement = this.htmlRoot.querySelector("body")!;
        return this.htmlRoot;
    }

    clone(): Page {
        return new Page({
            props: this.props,
            htmlRoot: this.htmlRoot,
            bodyElement: this.htmlElement,
            children: this.children,
        });
    }

    addChild(child: ComponentNode<any>, index?: number) {
        addChild(this, child, index);
    }

    removeChild(child: ComponentNode<any>) {
        removeChild(this, child);
    }

    findChildById(id: string): ComponentNode<any> | null {
        for (const child of this.children) {
            //const node = findByIdInComp(child, id);
            const node = child.findChildById(id);
            if (node) return node;
        }

        return null;
    }

    serialize(): SerializedPage {
        return {
            id: this.id,
            props: this.props,
            children: this.children.map(c => c.serialize()),
        }
    }

    toString(): string {
        return `Component: ${this.type}`;
    }
}

export interface SerializedPage {
    id: string;
    props: PageProps;
    children: SerializedComponentNode<any>[];
}

//export function getCleanHtml(page: Page) {
//
//    // must initialize the 'children' array of Page to have
//    // the correct htmlElement nodes
//
//    function build(comp: ComponentNode<any>): HTMLElement { 
//        const elem = comp.comp.createHtmlElement(
//            comp.props,
//            comp.children?.map(build),
//        );
//
//        console.log("built", comp, elem);
//        return elem;
//    }
//
//    function buildComponent(comp: ComponentNode<any>) {
//        const plugin = ComponentPluginManager.getPlugin(serializedComp.type);
//
//        const comp: ComponentNode<T> = new ComponentWrapper({
//            id: serializedComp.id,
//            type: serializedComp.type,
//            componentName: plugin.name,
//            comp: new plugin.constructorFunc(),
//            props: serializedComp.props,
//            children: serializedComp.children?.map(c => ComponentRepository.loadComponent(c)),
//        });
//
//        // the parent needs to be set explicitly
//        comp.children?.forEach(child => { child.parent = comp });
//
//        EventDispatcher.publish(EventType.COMPONENT_LOADED, { component: comp });
//        return comp;
//    }
//
//    const htmls = page.children.map(build);
//    console.log(htmls);
//    console.log(page.children);
//
//    page.children.map(c => console.log(c.htmlElement));
//
//    htmls.map(c => console.log(c));
//
//    const c = new Page({
//        props: page.props,
//        children: page.children,
//    });
//}

