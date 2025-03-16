import { ComponentTreeEvent, EventDispatcher, EventType } from "./EventDispatcher";
import { Page } from "./page/Page";
import { PropsDescriptorRoot, createDefaultProps } from "./props/PropsDescriptor";
import { createId } from "./utils";
import { ChildrenContainer, IComponent } from "./types";

export interface ComponentNode extends ChildrenContainer{
    comp: IComponent;
    type: string;
    componentName: string;
    propsDescriptorRoot: PropsDescriptorRoot;

    id: string;
    props: any;
    htmlElement: HTMLElement;

    parent?: ComponentNode | Page;
    children?: ComponentNode[];
    childrenHtml?: HTMLElement[];

    // editor augmentations
    wrapperDiv?: HTMLElement;

    createHtmlElementTree: () => HTMLElement;

    clone: () => ComponentNode;

    update(props: any): void;

    remove(): void;

    addSibling(child: ComponentNode, position: 'before' | 'after'): void;

    addChild(child: ComponentNode, index?: number): void;

    removeChild(child: ComponentNode): void;

    findChildById(id: string): ComponentNode | null;

    serialize(): SerializedComponentNode

    // editor augmentations
    addWrapperOverlay(overlay: HTMLElement): void;
    removeWrapperOverlay(): void;

    toString(): string;
}

export interface SerializedComponentNode {
    type: string;

    id: string;
    props: any;

    children?: SerializedComponentNode[];
}

export interface ComponentWrapperArgs {
    comp: IComponent;
    type: string;
    componentName: string;
    id?: string;
    props?: any;
    children?: ComponentNode[];
    parent?: ComponentNode | Page;
}

export class ComponentWrapper implements ComponentNode {

    comp: IComponent;
    type: string;
    componentName: string;

    id: string;
    props: any;
    htmlElement: HTMLElement;

    // set by the parent when this element is added
    parent?: ComponentNode | Page;
    children?: ComponentNode[];
    childrenHtml?: HTMLElement[];

    // editor augmentations
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
    }: ComponentWrapperArgs) {
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
        // TODO: have a single root html element which would always
        // contain the root element of the component, be it the actual html or 
        // the wrapper div.
        
        // be careful when getting the children's htmlElement, 
        // they may have wrappers
        this.childrenHtml = this.children?.map(c => c.wrapperDiv || c.htmlElement);
        const html = this.comp.createHtmlElement(this.props, this.childrenHtml);
        return html;
    }

    // Shallow clone except for the name and props
    // to satisfy the copy component functionality.
    // Doesn't clone the wrappers so we get a clean copy.
    clone(): ComponentNode {

        const copy = new ComponentWrapper({
            comp: this.comp,
            type: this.type,
            componentName: this.componentName,
            props: structuredClone(this.props),
            parent: this.parent,
            children: this.children?.map(c => c.clone()),
        });
        
        // the parent must be set for the children after the object is created
        copy.children?.forEach(c => {
            c.parent = copy;
        });

        return copy;
    }

    get propsDescriptorRoot(): PropsDescriptorRoot {
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

    addSibling(sibling: ComponentWrapper, position: 'before' | 'after') {
        if (!this.parent || !this.parent.children) return;

        let refIndex = this.parent.children.findIndex(c => c.id === this.id);
        if (refIndex === -1) return;

        const reference = this.wrapperDiv || this.htmlElement;
        const elemToInsert = sibling.wrapperDiv || sibling.htmlElement;

        console.log("sibling insert", sibling, position);
        console.log("reference", reference, elemToInsert);

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

        EventDispatcher.publish(
            EventType.COMPONENT_ADDED,
            { parent: this.parent, component: sibling, position } as ComponentTreeEvent,
        );
    }

    addChild(child: ComponentWrapper, index?: number) {

        if (!this.children) return;
        
        // insert the wrapper directly if it's defined
        const elemToInsert = child.wrapperDiv || child.htmlElement;

        if (index && index > 0 && index < this.children.length) {
            console.log("inserting at index", index);
            
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
            { parent: this, component: child } as ComponentTreeEvent,
        );
    }

    removeChild(child: ComponentWrapper) {
        child.remove();

        EventDispatcher.publish(
            EventType.COMPONENT_REMOVED,
            { parent: child.parent, component: child }
        );
    }

    // NOTE: this returns the element itself if the id matches
    findChildById(id: string): ComponentWrapper | null {
        if (this.id == id) return this;

        if (!this.children) return null;

        for (const child of this.children) {
            const node = child.findChildById(id);
            if (node) return node;
        }

        return null;
    }

    serialize(): SerializedComponentNode {
        const objectToSave: SerializedComponentNode = {
            type: this.type,
            id: this.id,
            props: this.props,
        }

        if (this.children) {
            objectToSave.children = this.children.map(c => c.serialize());
        }

        return objectToSave;
    }

    addWrapperOverlay(overlay: HTMLElement) {
        if (this.wrapperDiv !== undefined) {
            console.log("wrapper already exists, replacing it ", this.wrapperDiv, overlay);
            this.wrapperDiv.remove();
        }

        // get the position of the child html, wrap it
        this.wrapperDiv = overlay;

        this.htmlElement.replaceWith(this.wrapperDiv);
        this.wrapperDiv.appendChild(this.htmlElement);
    }

    // TODO: unused??
    // remove() also removes the wrapper
    removeWrapperOverlay() {
        if (this.wrapperDiv) {
            this.wrapperDiv.replaceWith(this.htmlElement);
            this.wrapperDiv = undefined;
        }
    }

    toString(): string {
        return `ComponentWrapper: ${this.id}\n` + this.comp.toString();
    }
}

