import { PropsDesc } from "../components-meta/PropsDescriptor";
import { createId } from "./utils";

export class Component {

    // static 
    type: string;
    propsDescriptor: PropsDesc;

    // dynamic, exists once created
    id: string;
    props: any;
    htmlElement: HTMLElement;

    // set by a ChildrenContainer when this element is added
    //parent?: Component;
    parent?: ChildrenContainer;

    //acceptsChildren: boolean;
    //children?: Component[];

    constructor(type: string, props: any, propsDescriptor: PropsDesc) {
        this.type = type;
        this.id = createId(type);
        this.props = props;
        this.propsDescriptor = propsDescriptor;
        //this.acceptsChildren = false;

        // calls the function on the descendant
        this.htmlElement = this.createHtmlElement();
    }

    createHtmlElement(): HTMLElement {
        throw new Error("base component createHtml is not implemented");
    }

    clone(): Component {
        throw new Error("base component clone is not implemented");
    }

    update(props: any) {
        this.props = props;
        const newElement = this.createHtmlElement();
        this.htmlElement.replaceWith(newElement);
        this.htmlElement = newElement;
    }

    addSibling(child: Component, position: 'before' | 'after') {
        if (!this.parent || !this.parent.children) return;

        let refIndex = this.parent.children.findIndex(c => c.id === this.id);
        if (refIndex === -1) return;

        if (position == 'before') {
            this.htmlElement.insertAdjacentElement('beforebegin', child.htmlElement);
        } else if (position == 'after') {
            this.htmlElement.insertAdjacentElement('afterend', child.htmlElement);
            refIndex++;
        }

        // update children array
        this.parent.children.splice(refIndex, 0, child);

        // update parent
        child.parent = this.parent;

        console.log("DOM: added sibling", child, " to this", this, position);
    }

    //addChild(child: Component, index?: number) {
    //    if (!this.children) return;
    //
    //    console.log("add child", child, index);
    //
    //    if (index && index > -1 && index < this.children.length) {
    //        this.children.splice(index, 0, child);
    //        if (this.htmlElement) {
    //            const node = this.htmlElement.childNodes.item(index);
    //            node.insertBefore(node, child.htmlElement);
    //        }
    //    } else {
    //        this.children.push(child);
    //        if (this.htmlElement) {
    //            this.htmlElement.appendChild(child.htmlElement);
    //        }
    //    }
    //    child.parent = this;
    //}
    //
    //removeChild(child: Component) {
    //    if (!this.children) return;
    //
    //    this.children = this.children.filter(c => c.id !== child.id);
    //    child.htmlElement.remove();
    //}
    //
    //findChildById(id: string): Component | null {
    //    if (!this.children) return null;
    //
    //    for (const child of this.children) {
    //
    //        if (child.id === id) return child;
    //
    //        // @ts-ignore
    //        if (!child.findChildById) continue;
    //
    //        // @ts-ignore
    //        const node = child.findChildById(id);
    //        if (node) return node;
    //    }
    //    return null;
    //}

    toString(): string {
        return `Component: ${this.type}`;
    }
};



// can't really type 'Comp' here...
//export function ChildrenContainerMixin(Comp: new () => any = Object) {
//export function ChildrenContainerMixin(Comp: (new (...args: any[]) => any)) {
//    return class ChildrenContainerImpl extends Comp {
//
//        // the constructor will be the same, pass in whatever arguments the extended 
//        // class took
//
//        children: (Component | Component & ChildrenContainer)[] = [];
//
//        isEmpty(): boolean {
//            return this.children && this.children.length > 0;
//        }
//
//        addChild(child: Component, index?: number) {
//
//            console.log("add child", child, index);
//
//            if (index && index > -1 && index < this.children.length) {
//                this.children.splice(index, 0, child);
//                const node = this.htmlElement.childNodes.item(index);
//                node.insertBefore(node, child.htmlElement);
//            } else {
//                this.children.push(child);
//                this.htmlElement.appendChild(child.htmlElement);
//            }
//            child.parent = this;
//        }
//
//        removeChild(child: Component) {
//            this.children = this.children.filter(c => c.id !== child.id);
//            this.child.htmlElement.remove();
//        }
//
//        findChildById(id: string): Component | null {
//
//            for (const child of this.children) {
//
//                if (child.id === id) return child;
//
//                // @ts-ignore
//                if (!child.findChildById) continue;
//
//                // @ts-ignore
//                const node = child.findChildById(id);
//                if (node) return node;
//            }
//            return null;
//        }
//    };
//}

//export interface Component {
//
//    // static 
//    type: string;
//    propsDescriptor: PropsDesc;
//
//    // dynamic, existing once created
//    id: string;
//    props: any;
//    htmlElement: HTMLElement;
//
//    // set by a ChildrenContainer when this element is added
//    parent?: ChildrenContainer;
//
//    update: (props: any) => void;
//    createHtmlElement: () => HTMLElement;
//    clone: () => any;
//    addSibling: (child: Component, position: 'before' | 'after') => void;
//};

export interface ChildrenContainer {
    children: Component[];
    isEmpty: () => boolean;
    addChild: (child: Component, index?: number) => void;
    removeChild: (child: Component) => void;
    findChildById: (id: string) => Component | null;
};


//export function mixinChildrenContainer<T extends any>(type: T): T & typeof childrenContainerMixin {
//    return Object.assign(type.prototype, childrenContainerMixin);
//}
//
//export const childrenContainerMixin = {
//
//    children: [] as (Component | Component & ChildrenContainer)[],
//
//    isEmpty(): boolean {
//        return this.children && this.children.length > 0;
//    },
//
//    addChild(child: Component, index?: number) {
//
//        console.log("add child", child, index);
//
//        if (index && index > -1 && index < this.children.length) {
//            this.children.splice(index, 0, child);
//            if (this.htmlElement) {
//                const node = this.htmlElement.childNodes.item(index);
//                node.insertBefore(node, child.htmlElement);
//            }
//        } else {
//            this.children.push(child);
//            if (this.htmlElement) {
//                this.htmlElement.appendChild(child.htmlElement);
//            }
//        }
//        child.parent = this;
//    },
//
//    removeChild(child: Component) {
//        this.children = this.children.filter(c => c.id !== child.id);
//        child.htmlElement.remove();
//    },
//
//    findChildById(id: string): Component | null {
//
//        for (const child of this.children) {
//
//            if (child.id === id) return child;
//
//            // @ts-ignore
//            if (!child.findChildById) continue;
//
//            // @ts-ignore
//            const node = child.findChildById(id);
//            if (node) return node;
//        }
//        return null;
//    },
//};

// Base component interface
interface MyComponent {
    render(): string;
}

// Mixin for components that accept children
export function ChildrenContainerMixin<T extends new (...args: any[]) => {}>(
    Base: T
) {
    return class extends Base implements ChildrenContainer {
        
        children: (Component | Component & ChildrenContainer)[] = [];

        isEmpty(): boolean {
            return this.children && this.children.length > 0;
        }

        addChild(child: Component, index?: number) {

            console.log("add child", child, index);

            if (index && index > -1 && index < this.children.length) {
                this.children.splice(index, 0, child);
                if ("htmlElement" in this) {
                    const node = (this.htmlElement as HTMLElement).childNodes.item(index);
                    node.insertBefore(child.htmlElement, node);
                }
            } else {
                this.children.push(child);
                if ("htmlElement" in this) {
                    (this.htmlElement as HTMLElement).appendChild(child.htmlElement);
                }
            }
            child.parent = this;
        }

        removeChild(child: Component) {
            this.children = this.children.filter(c => c.id !== child.id);
            child.htmlElement.remove();
        }

        findChildById(id: string): Component | null {

            for (const child of this.children) {

                if (child.id === id) return child;

                // @ts-ignore
                if (!child.findChildById) continue;

                // @ts-ignore
                const node = child.findChildById(id);
                if (node) return node;
            }
            return null;
        }
    };
}

// Mixin for components that do not accept children
//function SimpleComponentMixin<T extends new (...args: any[]) => {}>(
//    Base: T
//) {
//    return class extends Base {
//        render(): string {
//            return `<div>Simple Component</div>`;
//        }
//    };
//}

// Example of a component that accepts children
const ParentComponent = ChildrenContainerMixin(
    class implements MyComponent {
        render(): string {
            return `<div>Parent Component</div>`;
        }
    }
);

// Example of a component that does not accept children
//class ChildComponent extends SimpleComponentMixin(
//    class implements MyComponent {
//        render(): string {
//            return `<div>Child Component</div>`;
//        }
//    }
//) { }
//

// Usage
//const parent = new ParentComponent();
//const child1 = new ChildComponent();
//const child2 = new ChildComponent();
//
//parent.addChild(child1);
//parent.addChild(child2);
//
//console.log(parent.render());


//export function MixinChildContainer(
//
//    export class ChildrenContainerImpl implements ChildrenContainer {
//
//    htmlElement?: HTMLElement;
//    children: (Component | Component & ChildrenContainer)[] = [];
//
//    isEmpty(): boolean {
//        return this.children && this.children.length > 0;
//    }
//
//    addChild(child: Component, index?: number) {
//
//        console.log("add child", child, index);
//
//        if (index && index > -1 && index < this.children.length) {
//            this.children.splice(index, 0, child);
//            if (this.htmlElement) {
//                const node = this.htmlElement.childNodes.item(index);
//                node.insertBefore(node, child.htmlElement);
//            }
//        } else {
//            this.children.push(child);
//            if (this.htmlElement) {
//                this.htmlElement.appendChild(child.htmlElement);
//            }
//        }
//        child.parent = this;
//    }
//
//    removeChild(child: Component) {
//        this.children = this.children.filter(c => c.id !== child.id);
//        child.htmlElement.remove();
//    }
//
//    findChildById(id: string): Component | null {
//
//        for (const child of this.children) {
//
//            if (child.id === id) return child;
//
//            // @ts-ignore
//            if (!child.findChildById) continue;
//
//            // @ts-ignore
//            const node = child.findChildById(id);
//            if (node) return node;
//        }
//        return null;
//    }
//};

//export type ComponentWithChildren = Component & ChildrenContainer;

//export class ComponentWithChildren extends Component implements ChildrenContainer {
//
//}
