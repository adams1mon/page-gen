import About from "../components/About";
import Column from "../components/Column";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Hero from "../components/Hero";
import Image from "../components/Image";
import Link from "../components/Link";
import List from "../components/List";
import Markdown from "../components/Markdown";
import Projects from "../components/Projects";
import Row from "../components/Row";
import Text from "../components/Text";
import Gallery from "../components/Gallery";
import Site, { tag } from "../components/Site";

import { ComponentDescriptor } from "./ComponentDescriptor";
import { FunctionComponent, createElement } from "react";
import { renderToHtml } from "../site-generator/generate-html";
import { createPortal } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";


// utility methods, they mutate the passed in component

export function insertChild(comp: ComponentDescriptor, child: ComponentDescriptor, index?: number): ComponentDescriptor {
    const newDescriptors = [...comp.childrenDescriptors];
    if (index) {
        newDescriptors.splice(index, 0, child);
    } else {
        newDescriptors.push(child);
    }
    comp.childrenDescriptors = newDescriptors;
    return comp;
};

export function removeChild(comp: ComponentDescriptor, child: ComponentDescriptor): ComponentDescriptor {
    comp.childrenDescriptors = comp.childrenDescriptors.filter(c => c.id !== child.id);
    return comp;
};

export function updateComponentInTree(comp: ComponentDescriptor, toUpdate: ComponentDescriptor): ComponentDescriptor {
    if (comp.id == toUpdate.id) {
        return toUpdate;
    }
    if (comp.acceptsChildren) {
        return {
            ...comp,
            childrenDescriptors: comp.childrenDescriptors.map((c) => updateComponentInTree(c, toUpdate)),
        };
    }
    return comp;
}

export function findParentComponent(root: ComponentDescriptor, comp: ComponentDescriptor): ComponentDescriptor | null {
    if (!root.acceptsChildren) return null;

    for (const child of root.childrenDescriptors) {
        if (child.id === comp.id) return root;
        const found = findParentComponent(child, comp);
        if (found) return found;
    }

    return null;
}

export function removeUnsavableAttributes(comp: ComponentDescriptor): ComponentDescriptor {

    if (comp.acceptsChildren) {
        const newComp: ComponentDescriptor = {
            ...comp,
            childrenDescriptors: comp.childrenDescriptors.map(removeUnsavableAttributes),
        };
        delete newComp.props.children;
        delete newComp.domNode;
        return newComp;
    }

    return {
        ...comp
    };
}

export function findByIdInTree(root: ComponentDescriptor, id: string): ComponentDescriptor | null {

    if (root.id == id) return root;

    if (root.acceptsChildren) {
        for (const child of root.childrenDescriptors) {
            const node = findByIdInTree(child, id);
            if (node) return node;
        }
    }

    return null;
}

export type ToHtmlFunc = (props?: object) => HTMLElement;

// holds component descriptors and creates new component descriptors based on the templates
export class ComponentContainer {
    static components: { [type: string]: ComponentDescriptor } = {};
    static htmlFuncs: { [type: string]: ToHtmlFunc } = {};

    static save(
        config: ComponentExport
    ) {
        this.components[config.type] = config.descriptor;
        this.htmlFuncs[config.type] = config.createHtmlNode;
    }

    //static getReactElement(type: string): React.FunctionComponent<any> {
    //    return this.jsxFuncs[type];
    //}

    static createId(type: string): string {
        return `${type}-${Date.now()}`;
    }

    static createInstance(type: string): ComponentDescriptor {
        const desc = this.getDescriptor(type);

        if (!desc) {
            throw new Error(`Component of type ${type} does not exist`);
        }

        const id = this.createId(type);
        const domNode = this.htmlFuncs[type](desc.props);

        domNode.setAttribute("data-id", id);

        return {
            ...desc,
            id,
            domNode,
        }
    }

    static addChild(parent: ComponentDescriptor, child: ComponentDescriptor) {
        if (!parent.domNode) throw new Error("parent has no DOM node");
        if (!child.domNode) throw new Error("child has no DOM node");

        parent.domNode.appendChild(child.domNode);
        parent.childrenDescriptors.push(child);
        child.parent = parent;

        console.log("DOM: added child", child, " to parent", parent);
    }

    static addSibling(reference: ComponentDescriptor, child: ComponentDescriptor, position: 'before' | 'after') {
        if (!reference.domNode) throw new Error("parent has no DOM node");
        if (!child.domNode) throw new Error("child has no DOM node");

        const parent = reference.parent;
        let index = parent?.childrenDescriptors.findIndex(c => c.id == reference.id);

        if (position == 'before') {
            reference.domNode.insertAdjacentElement('beforebegin', child.domNode);
        } else if (position == 'after') {
            reference.domNode.insertAdjacentElement('afterend', child.domNode);

            if (index && index > -1) {  
                index++;
            }
        } 
        
        // update descriptors
        if (index !== undefined && index !== -1) {  
            parent!.childrenDescriptors.splice(index, 0, child);
        }

        // update parent
        child.parent = reference.parent;

        console.log("DOM: added sibling", child, " to reference", reference);
    }

    static removeChild(child: ComponentDescriptor) {
        child.domNode?.remove();
        if (child.parent) {
            child.parent.childrenDescriptors = child.parent.childrenDescriptors.filter(c => c.id !== child.id);
        }
    };

    static clone(component: ComponentDescriptor): ComponentDescriptor {
        // Clone children recursively if they exist
        const clonedChildren = component.acceptsChildren
            ? component.childrenDescriptors.map(child => this.clone(child))
            : [];

        return {
            ...component,
            id: this.createId(component.type),
            childrenDescriptors: clonedChildren
        };
    }

    static getDescriptor(type: string): ComponentDescriptor | undefined {
        return this.components[type];
    }

    // Returns the components that are allowed to be created,
    // so everything besides the Site itself.
    // Otherwise we could have nested Sites, 
    // because the Site is also a component.
    static getAvailableComponents(): ComponentDescriptor[] {
        // omit the Site
        const { [Site.type]: _, ...rest } = this.components;
        return Object.values(rest);
    }
}

export function createHtmlNodeFromReact(node: FunctionComponent<any>, props: any): HTMLElement {
    const doc = Document.parseHTMLUnsafe(
        renderToStaticMarkup(createElement(node, props)),
    );
    
    return doc.querySelector('body *');
}

export interface ComponentExport {
    type: string;
    descriptor: ComponentDescriptor;
    createHtmlNode: ToHtmlFunc;
};

//export const DOM_NODES: {[key: string]: HTMLElement } = {};

// register the components
ComponentContainer.save(Site);

// container components 
//ComponentContainer.save(Container);
//ComponentContainer.save(Column);
ComponentContainer.save(Row);
//ComponentContainer.save(List);

// basic components
//ComponentContainer.save(Text);
ComponentContainer.save(Heading);
//ComponentContainer.save(Link);
//ComponentContainer.save(Image);

// composite components
//ComponentContainer.save(About);
//ComponentContainer.save(Footer);
//ComponentContainer.save(Header);
ComponentContainer.save(Hero);
//ComponentContainer.save(Markdown);
//ComponentContainer.save(Projects);
//ComponentContainer.save(Gallery);


//import Button from "../components/Button"
//ComponentContainer.save(Button);

//console.log(DOM_NODES);



//function addMouseHandlers(component: ComponentDescriptor) {
//    console.log("adding mouse handlers");
//
//    if (!component.domNode) {
//        console.warn("no DOM node on ", component.type);
//        return;
//    }
//
//    component.domNode.onmouseenter = () => addOverlay(component);
//    component.domNode.onmouseleave = () => removeOverlay(component);
//}
//
//function addOverlay(component: ComponentDescriptor) {
//    const node = component.domNode!;
//
//    const rect = node.getBoundingClientRect();
//
//    const outlineDiv = tag("div", { id: `outline-${component.id}` });
//    outlineDiv.style.position = "absolute";
//    outlineDiv.style.left = rect.x + window.scrollX + 'px';
//    outlineDiv.style.top = rect.y + window.scrollY + 'px';
//    outlineDiv.style.width = rect.width + 'px';
//    outlineDiv.style.height = rect.height + 'px';
//    outlineDiv.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
//    outlineDiv.style.outline = "solid 1px red";
//    outlineDiv.style.pointerEvents = "none";
//
//    //outlineDiv.classList.add(..."outline outline-2 outline-primary/20 rounded-sm".split(" "));
//
//    //console.log("outline div", outlineDiv);
//
//    const body = document.querySelector("body");
//    body.appendChild(outlineDiv);
//
//    // create a little tab with the name of the component
//    const tab = tag("p", { id: `tab-${component.id}` });
//
//    const cls = "bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium"
//    tab.classList.add(...cls.split(" "));
//    tab.innerText = component.name;
//
//    tab.style.position = "absolute";
//    tab.style.zIndex = '10';
//    tab.style.left = '0px';
//
//    // get the height and displace the tab
//    tab.style.visibility = "hidden";
//    outlineDiv.appendChild(tab);
//
//    tab.style.top = -tab.getBoundingClientRect().height + 'px';
//    tab.style.visibility = "visible";
//}
//
//function removeOverlay(component: ComponentDescriptor) {
//
//    const node = component.domNode!;
//    node.style.outline = "none";
//
//    const body = document.querySelector("body");
//    const tab = body.querySelector(`#tab-${component.id}`);
//    if (!tab) {
//        console.warn("overlay tab not found on ", component);
//    } else {
//        tab.remove();
//    }
//
//    const outlineDiv = body.querySelector(`#outline-${component.id}`);
//    if (!outlineDiv) {
//        console.warn("overlay tab not found on ", component);
//    } else {
//        outlineDiv.remove();
//    }
//}
