import { EventDispatcher } from "./EventQueue";
import { Page } from "./page/Page";
import { PropsDesc, createDefaultProps } from "./props/PropsDescriptor";
import { addChild, addSibling, createId, findByIdInComp, removeChild } from "./tree-actions";
import { IComponent } from "./types";

export class ComponentWrapper<T> {

    type: string;
    comp: IComponent<T>;

    id: string;
    props: T;
    htmlElement: HTMLElement;

    // set by the parent when this element is added
    parent?: ComponentWrapper<T> | Page;
    children?: ComponentWrapper<any>[];
    childrenHtml?: HTMLElement[];

    constructor(type: string, comp: IComponent<T>) {
        this.type = type;
        this.comp = comp;

        this.id = createId(type);
        this.props = comp.initialProps ?? createDefaultProps(comp.propsDescriptor);

        // initialize children so 'if (children)' checks return true
        if (comp.acceptsChildren) {
            this.children = [];
        }

        this.htmlElement = this.createHtmlElementTree();

        // TODO:
        // must set the data-id attribute every time we create a component?
        // could this not be done by the preview??
        this.htmlElement.setAttribute("data-id", this.id);
    }

    createHtmlElementTree(): HTMLElement {
        this.childrenHtml = this.children?.map(c => c.createHtmlElementTree());
        return this.comp.createHtmlElement(this.props, this.childrenHtml);
    }

    clone(): ComponentWrapper<T> {
        const copy = new ComponentWrapper(this.type, this.comp);
        copy.props = structuredClone(this.props);
        return copy;
    }

    get propsDescriptor(): PropsDesc {
        return this.comp.propsDescriptor;
    }

    update(props: T) {
        this.props = props;
        const newElement = this.comp.update ? this.comp.update(this.props) : this.createHtmlElementTree();
        this.htmlElement.replaceWith(newElement);
        this.htmlElement = newElement;
        this.htmlElement.setAttribute("data-id", this.id);
    }

    addSibling(child: ComponentWrapper<T>, position: 'before' | 'after') {
        addSibling(this, child, position);
    }

    addChild(child: ComponentWrapper<T>, index?: number) {
        addChild(this, child, index);
        EventDispatcher.publish("addchild", child.htmlElement);
    }

    removeChild(child: ComponentWrapper<T>) {
        removeChild(this, child);
    }

    findChildById(id: string): ComponentWrapper<T> | null {
        return findByIdInComp(this, id);
    }

    toString(): string {
        return `ComponentWrapper: ${this.id}\n` + this.comp.toString();
    }
}
