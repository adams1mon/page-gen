import { ComponentTreeEvent, EventDispatcher, EventType } from "./EventDispatcher";
import { Page } from "./page/Page";
import { PropsDesc, createDefaultProps } from "./props/PropsDescriptor";
import { addChild, addSibling, createId, findByIdInComp, remove, removeChild } from "./tree-actions";
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
    wrapperDiv?: HTMLElement;

    createHtmlElementTree: () => HTMLElement;

    clone: () => ComponentNode<T>;

    update(props: T): void;

    remove(): void;

    addSibling(child: ComponentNode<T>, position: 'before' | 'after'): void;

    addChild(child: ComponentNode<T>, index?: number): void;

    removeChild(child: ComponentNode<T>): void;

    findChildById(id: string): ComponentNode<T> | null;

    serialize(): SerializedComponentNode<T>

    addWrapperOverlay(): HTMLElement;
    removeWrapperOverlay(): void;

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

    // wrapper to be used by the editor
    wrapperDiv?: HTMLElement;

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
        // TODO: add children here too???
        const copy = new ComponentWrapper({
            comp: this.comp,
            type: this.type,
            componentName: this.componentName,
            props: structuredClone(this.props),
            parent: this.parent,
            children: this.children,
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

    remove() {
        //remove(this);

        //if (this.wrapperDiv) {
        //    this.removeWrapperOverlay();
        //}

        this.htmlElement.remove();
        this.wrapperDiv?.remove();
        this.wrapperDiv = undefined;

        if (this.parent && this.parent.children) {
            this.parent.children = this.parent.children.filter(c => c.id !== this.id);
        }

        EventDispatcher.publish(
            EventType.COMPONENT_REMOVED,
            { parent: this.parent, component: this },
        );
    }

    addSibling(sibling: ComponentWrapper<T>, position: 'before' | 'after') {
        //addSibling(this, sibling, position);

        if (!this.parent || !this.parent.children) return;

        let refIndex = this.parent.children.findIndex(c => c.id === this.id);
        if (refIndex === -1) return;

        const reference = this.wrapperDiv || this.htmlElement;
        const elemToInsert = sibling.wrapperDiv || sibling.htmlElement;

        if (position == 'before') {
            reference.insertAdjacentElement('beforebegin', elemToInsert);
        } else if (position == 'after') {
            reference.insertAdjacentElement('afterend', elemToInsert);
            refIndex++;
        }

        // update children array
        this.parent.children.splice(refIndex, 0, sibling);

        // update parent
        sibling.parent = this.parent;

        console.log("DOM: added sibling", sibling, " to reference", this, position);

        EventDispatcher.publish(
            EventType.COMPONENT_ADDED,
            { parent: this.parent, component: sibling, position } as ComponentTreeEvent,
        );
    }

    addChild(child: ComponentWrapper<T>, index?: number) {
        //addChild(this, child, index);

        if (!this.children) return;

        // insert the wrapper directly if it's defined
        const elemToInsert = child.wrapperDiv || child.htmlElement;

        if (index && index > -1 && index < this.children.length) {

            const reference = this.children[index];

            // insert the child at 'index'
            this.children.splice(index, 0, child);

            // TODO: fix bug 
            // Try to insert more elements into a Row and sometimes it happens.
            // NotFoundError: Node.insertBefore: Child to insert before is not a child of this node
            //node.insertBefore(child.htmlElement, node);

            // insert before the wrapper if it's defined
            const elem = reference.wrapperDiv || reference.htmlElement;
            elem.insertAdjacentElement("beforebegin", elemToInsert);

        } else {
            this.children.push(child);
            this.htmlElement.appendChild(elemToInsert);
        }

        child.parent = this;

        EventDispatcher.publish(
            EventType.COMPONENT_ADDED,
            { parent: this, component: child } as ComponentTreeEvent,
        );
    }

    removeChild(child: ComponentWrapper<T>) {
        //removeChild(this, child);

        child.remove();

        EventDispatcher.publish(
            EventType.COMPONENT_REMOVED,
            { parent: child.parent, component: child }
        );
    }

    // NOTE: this returns the element itself if the id matches
    findChildById(id: string): ComponentWrapper<T> | null {
        //return findByIdInComp(this, id);

        if (this.id == id) return this;

        if (!this.children) return null;

        for (const child of this.children) {
            const node = child.findChildById(id);
            if (node) return node;
        }

        return null;
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

    addWrapperOverlay(): HTMLElement {

        // DOM surgery here, this code will insert a wrapper div around the html of the 
        // current component. If this is a container component, the html of the child
        // elements should already have this wrapper around them, because their html must 
        // be created before the container component's.

        const wrapperId = createWrapperId(this.id);

        if (this.wrapperDiv) {
            console.log("wrapper already present, comp", this);
            return this.wrapperDiv;
        }

        // add an overlay wrapper div, maybe could also contain the container empty placeholder?
        const wrapperDiv = document.createElement("div");
        wrapperDiv.dataset.wrapperId = wrapperId;
        wrapperDiv.style.position = "relative";

        // add a floating tab in the top left with the name of the component
        const nameTab = document.createElement("div");
        nameTab.innerText = this.componentName;
        nameTab.style.position = "fixed";
        nameTab.style.position = "absolute";
        nameTab.style.top = "0";
        nameTab.style.left = "0";
        nameTab.style.backgroundColor = "white";
        nameTab.style.color = "black";
        nameTab.style.zIndex = "999";
        nameTab.style.padding = "0 0.2rem";
        nameTab.style.borderBottomRightRadius = "0.3rem";
        nameTab.style.opacity = "0.5";
        nameTab.style.display = "none";

        wrapperDiv.appendChild(nameTab);

        wrapperDiv.onmouseenter = () => {
            wrapperDiv.style.outline = "2px dashed hsl(0, 0%, 20%)";
            wrapperDiv.style.backgroundColor = "hsl(0, 0%, 80%, 0.3)";
            nameTab.style.display = "block";
        }

        wrapperDiv.onmouseleave = () => {
            wrapperDiv.style.outline = "";
            wrapperDiv.style.backgroundColor = "";
            nameTab.style.display = "none";
        }

        this.parent?.htmlElement.appendChild(wrapperDiv);

        // this append detaches this.htmlElement from its previous position
        wrapperDiv.appendChild(this.htmlElement);
        this.wrapperDiv = wrapperDiv;

        return this.wrapperDiv;
    }

    // TODO: unused??
    // remove() also removes the wrapper
    removeWrapperOverlay() {
        console.log("removing overlay, adding", this.htmlElement, "to", this.parent?.htmlElement);

        // this append removes the htmlElement from wrapperDiv
        this.parent?.htmlElement.appendChild(this.htmlElement);
        this.wrapperDiv?.remove();
    }

    toString(): string {
        return `ComponentWrapper: ${this.id}\n` + this.comp.toString();
    }
}

function createWrapperId(id: string): string {
    return "wrapper-" + id;
}
