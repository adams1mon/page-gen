import { EventDispatcher, EventType } from "./EventDispatcher";
import { Page } from "./page/Page";
import { PropsDesc, createDefaultProps } from "./props/PropsDescriptor";
import { addChild, addSibling, createId, findByIdInComp, removeChild } from "./tree-actions";
import { IComponent } from "./types";

export interface ComponentNode<T> {
    type: string;
    comp: IComponent<T>;
    propsDescriptor: PropsDesc;

    id: string;
    props: T;
    htmlElement: HTMLElement;

    parent?: ComponentNode<T> | Page;
    children?: ComponentNode<any>[];
    childrenHtml?: HTMLElement[];

    createHtmlElementTree: () => HTMLElement;

    clone: () => ComponentNode<T>;

    update(props: T): void;

    addSibling(child: ComponentNode<T>, position: 'before' | 'after'): void;

    addChild(child: ComponentNode<T>, index?: number): void;

    removeChild(child: ComponentNode<T>): void;

    findChildById(id: string): ComponentNode<T> | null;

    toString(): string;
}

export class ComponentWrapper<T> implements ComponentNode<T> {

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

        EventDispatcher.publish(
            EventType.COMPONENT_HTML_CREATED,
            { newHtml: this.htmlElement, id: this.id },
        );
    }

    createHtmlElementTree(): HTMLElement {
        this.childrenHtml = this.children?.map(c => c.createHtmlElementTree());
        const html = this.comp.createHtmlElement(this.props, this.childrenHtml);
        EventDispatcher.publish(
            EventType.COMPONENT_HTML_CREATED,
            { newHtml: html, id: this.id },
        );
        return html;
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
        const newElement = this.comp.update?.(this.props) ?? this.createHtmlElementTree();
        this.htmlElement.replaceWith(newElement);
        this.htmlElement = newElement;
    }

    addSibling(child: ComponentWrapper<T>, position: 'before' | 'after') {
        addSibling(this, child, position);
    }

    addChild(child: ComponentWrapper<T>, index?: number) {
        addChild(this, child, index);
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

