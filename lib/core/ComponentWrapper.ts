import { EventDispatcher, EventType } from "./EventDispatcher";
import { Page } from "./page/Page";
import { PropsDesc, createDefaultProps } from "./props/PropsDescriptor";
import { addChild, addSibling, createId, findByIdInComp, removeChild } from "./tree-actions";
import { IComponent } from "./types";

export interface ComponentNode<T> {
    comp: IComponent<T>;
    type: string;
    componentName: string;
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

    serialize(): SerializedComponentNode<T>

    toString(): string;
}

export interface SerializedComponentNode<T> {
    type: string;

    id: string;
    props: T;

    children?: SerializedComponentNode<any>[];
}

export interface ComponentWrapperArgs<T> {
    comp: IComponent<T>;
    type: string;
    componentName: string;
    id?: string;
    props?: T;
    children?: ComponentNode<any>[];
    parent?: ComponentNode<any> | Page;
}

export class ComponentWrapper<T> implements ComponentNode<T> {

    comp: IComponent<T>;
    type: string;
    componentName: string;

    id: string;
    props: T;
    htmlElement: HTMLElement;

    // set by the parent when this element is added
    parent?: ComponentNode<any> | Page;
    children?: ComponentNode<any>[];
    childrenHtml?: HTMLElement[];

    constructor({
        comp,
        type,
        componentName,
        id,
        props,
        children,
        parent,
    }: ComponentWrapperArgs<T>) {
        this.comp = comp;
        this.type = type;
        this.componentName = componentName;

        this.id = id || createId(type);

        // initialize with props, initialProps or create the default props if both were undefined
        this.props = props || comp.initialProps || createDefaultProps(comp.propsDescriptor);

        // initialize children so 'if (children)' checks return true
        if (comp.acceptsChildren) {
            this.children = children || [];
        }

        this.parent = parent;
        this.htmlElement = this.createHtmlElementTree();
    }

    createHtmlElementTree(): HTMLElement {
        this.childrenHtml = this.children?.map(c => c.htmlElement);
        const html = this.comp.createHtmlElement(this.props, this.childrenHtml);
        return html;
    }

    clone(): ComponentNode<T> {
        const copy = new ComponentWrapper({
            comp: this.comp,
            type: this.type,
            componentName: this.componentName,
            props: structuredClone(this.props),
            parent: this.parent,
        });
        return copy;
    }

    get propsDescriptor(): PropsDesc {
        return this.comp.propsDescriptor;
    }

    update(props: T) {
        this.props = props;
        const newElement = this.comp.update?.(this.props) || this.createHtmlElementTree();
        this.htmlElement.replaceWith(newElement);
        this.htmlElement = newElement;

        EventDispatcher.publish(EventType.COMPONENT_UPDATED, { component: this });
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

    serialize(): SerializedComponentNode<T> {
        const objectToSave: SerializedComponentNode<T> = {
            type: this.type,
            id: this.id,
            props: this.props,
        }

        if (this.children) {
            objectToSave.children = this.children.map(c => c.serialize());
        }

        return objectToSave;
    }

    toString(): string {
        return `ComponentWrapper: ${this.id}\n` + this.comp.toString();
    }
}

//export class EventPublisherComponentProxy<T> extends ComponentWrapper<T> {
//
//    constructor(args) {
//        super(args);
//    }
//
//    createHtmlElementTree(): HTMLElement {
//        const html = super.createHtmlElementTree();
//        EventDispatcher.publish("COMPONENT_CREATE_HTML", { component: this });
//        return html;
//    }
//
//    clone(): ComponentNode<T> {
//        const copy = new EventPublisherComponentProxy({
//            comp: this.comp,
//            type: this.type,
//            componentName: this.componentName,
//            props: structuredClone(this.props),
//            parent: this.parent,
//        });
//        return copy;
//    }
//
//    update(props: T) {
//        super.update(props);
//        EventDispatcher.publish("COMPONENT_UPDATE", { component: this });
//    }
//
//    toString(): string {
//        return "EventPublisherProxy: " + super.toString();
//    }
//}
