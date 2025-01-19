import { EMPTY_DESCRIPTOR, PropsDesc, createDefaultProps } from "../components-meta/PropsDescriptor";
import { tag } from "../site-generator/generate-html";
import { Page } from "./Page";
import { addChild, addSibling, createId, findByIdInComp, removeChild } from "./utils";


export interface ChildrenContainer {
    children?: ComponentWrapper[];
    addChild: (child: ComponentWrapper, index?: number) => void;
    removeChild: (child: ComponentWrapper) => void;
    findChildById: (id: string) => ComponentWrapper | null;
};


export class CustomRow implements IComponent {

    componentName: string = "customrow";
    propsDescriptor: PropsDesc = EMPTY_DESCRIPTOR;
    acceptsChildren: boolean = true;

    createHtmlElement(props: any, children?: HTMLElement[]): HTMLElement {
        console.log("create custom row, props:", props);
        console.log("custom row got children", children);
        
        const d = tag("div", { "data-custom": "row" });
        d.innerText = "AAAAAH CUstom ROWW";
        return d;
    }
}

export interface IComponent {
    componentName: string;
    propsDescriptor: PropsDesc;
    initialProps?: any;
    acceptsChildren: boolean;
    createHtmlElement: (props: any, children?: HTMLElement[]) => HTMLElement;
    update?: (props: any, children?: HTMLElement[]) => HTMLElement;
}

export class ComponentWrapper {

    type: string;
    comp: IComponent;

    // dynamic, exists once created
    id: string;
    props: any;
    htmlElement: HTMLElement;

    // set by the parent when this element is added
    parent?: ComponentWrapper | Page;
    children?: ComponentWrapper[];
    childrenHtml?: HTMLElement[];

    constructor(type: string, comp: IComponent) {
        this.type = type;
        this.comp = comp;

        this.id = createId(type);
        this.props = comp.initialProps ?? createDefaultProps(comp.propsDescriptor);

        // initialize children so 'if (children)' parenthood checks return true
        if (comp.acceptsChildren) {
            this.children = [];
        }

        this.htmlElement = this.createHtmlElementTree();

        // must set the data-id attribute every time we create a component?
        // could this not be done by the preview??
        this.htmlElement.setAttribute("data-id", this.id);
    }

    createHtmlElementTree(): HTMLElement {
        this.childrenHtml = this.children?.map(c => c.createHtmlElementTree());
        return this.comp.createHtmlElement(this.props, this.childrenHtml);
    }

    clone(): ComponentWrapper {
        const copy = new ComponentWrapper(this.type, this.comp);
        copy.props = structuredClone(this.props);
        return copy;
    }

    get propsDescriptor(): PropsDesc {
        return this.comp.propsDescriptor;
    }

    update(props: any) {
        this.props = props;
        const newElement = this.comp.update ? this.comp.update(this.props) : this.createHtmlElementTree();
        this.htmlElement.replaceWith(newElement);
        this.htmlElement = newElement;
        this.htmlElement.setAttribute("data-id", this.id);
    }

    addSibling(child: ComponentWrapper, position: 'before' | 'after') {
        addSibling(this, child, position);
    }

    addChild(child: ComponentWrapper, index?: number) {
        addChild(this, child, index);
    }

    removeChild(child: ComponentWrapper) {
        removeChild(this, child);
    }

    findChildById(id: string): ComponentWrapper | null {
        return findByIdInComp(this, id);
    }

    toString(): string {
        return `ComponentWrapper: ${this.id}\n` + this.comp.toString();
    }
}

