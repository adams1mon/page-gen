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
import Site, { createSiteNode, tag } from "../components/Site";

import { ComponentDescriptor } from "./ComponentDescriptor";
import { createElement } from "react";
import { renderToHtml } from "../site-generator/generate-html";
import { createPortal } from "react-dom";


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

export function updateChild(comp: ComponentDescriptor, child: ComponentDescriptor): ComponentDescriptor {
    const newDescriptors = comp.childrenDescriptors.map(old =>
        old.id === child.id ? child : old
    );
    comp.childrenDescriptors = newDescriptors;
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

export function findComponentIndex(parent: ComponentDescriptor, comp: ComponentDescriptor): number {
    return parent.childrenDescriptors.findIndex(child => child.id === comp.id);
}

export function removeChildrenProps(comp: ComponentDescriptor): ComponentDescriptor {

    if (comp.acceptsChildren) {
        const newComp: ComponentDescriptor = {
            ...comp,
            childrenDescriptors: comp.childrenDescriptors.map(removeChildrenProps),
        };
        delete newComp.props.children;
        delete newComp.domNode;
        delete newComp.addChild;
        delete newComp.removeChild;
        return newComp;
    }

    return {
        ...comp
    };
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

        //const div = document.createElement("div");
        //div.innerHTML = renderToHtml(this.components[type]);
        //
        //DOM_NODES[type] = div;
        //
        return {
            ...desc,
            id: this.createId(type),
            domNode: this.htmlFuncs[type](desc.props),
        }
    }

    static addOrUpdateChild(parent: ComponentDescriptor, child: ComponentDescriptor) {
        if (!parent.domNode) throw new Error("parent has no DOM node");
        if (!child.domNode) throw new Error("child has no DOM node");

        const node = parent.domNode.querySelector(`#${child.id}`);
        if (node) {
            parent.domNode.replaceChild(child.domNode, parent.domNode);
        } else {
            parent.domNode.appendChild(child.domNode);
        }
        console.log("DOM: added child", child, " to parent", parent);

        const i = parent.childrenDescriptors.findIndex(c => c.id == child.id);
        if (i > -1) {
            parent.childrenDescriptors[i] = child;
        } else {
            parent.childrenDescriptors.push(child);
        }

        //console.log("descriptor: added child", child, " to parent", parent);
        //
        //addMouseHandlers(child);
    }

    static removeChild(parent: ComponentDescriptor, child: ComponentDescriptor) {
        parent.childrenDescriptors = parent.childrenDescriptors.filter(c => c.id !== child.id);
        child.domNode?.remove();
        removeOverlay(child);
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

function addMouseHandlers(component: ComponentDescriptor) {
    console.log("adding mouse handlers");

    if (!component.domNode) {
        console.warn("no DOM node on ", component.type);
        return;
    }

    component.domNode.onmouseenter = () => addOverlay(component);
    component.domNode.onmouseleave = () => removeOverlay(component);
}

function addOverlay(component: ComponentDescriptor) {
    const node = component.domNode!;

    const rect = node.getBoundingClientRect();

    const outlineDiv = tag("div", { id: `outline-${component.id}` });
    outlineDiv.style.position = "absolute";
    outlineDiv.style.left = rect.x + window.scrollX + 'px';
    outlineDiv.style.top = rect.y + window.scrollY + 'px';
    outlineDiv.style.width = rect.width + 'px';
    outlineDiv.style.height = rect.height + 'px';
    outlineDiv.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
    outlineDiv.style.outline = "solid 1px red";
    outlineDiv.style.pointerEvents = "none";

    //outlineDiv.classList.add(..."outline outline-2 outline-primary/20 rounded-sm".split(" "));

    //console.log("outline div", outlineDiv);

    const body = document.querySelector("body");
    body.appendChild(outlineDiv);

    // create a little tab with the name of the component
    const tab = tag("p", { id: `tab-${component.id}` });

    const cls = "bg-background backdrop-blur-sm px-2 py-1 text-xs font-medium"
    tab.classList.add(...cls.split(" "));
    tab.innerText = component.name;

    tab.style.position = "absolute";
    tab.style.zIndex = '10';
    tab.style.left = '0px';

    // get the height and displace the tab
    tab.style.visibility = "hidden";
    outlineDiv.appendChild(tab);

    tab.style.top = -tab.getBoundingClientRect().height + 'px';
    tab.style.visibility = "visible";
}

function removeOverlay(component: ComponentDescriptor) {

    const node = component.domNode!;
    node.style.outline = "none";

    const body = document.querySelector("body");
    const tab = body.querySelector(`#tab-${component.id}`);
    if (!tab) {
        console.warn("overlay tab not found on ", component);
    } else {
        tab.remove();
    }

    const outlineDiv = body.querySelector(`#outline-${component.id}`);
    if (!outlineDiv) {
        console.warn("overlay tab not found on ", component);
    } else {
        outlineDiv.remove();
    }
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
//ComponentContainer.save(Row);
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
//ComponentContainer.save(Hero);
//ComponentContainer.save(Markdown);
//ComponentContainer.save(Projects);
//ComponentContainer.save(Gallery);


//import Button from "../components/Button"
//ComponentContainer.save(Button);

//console.log(DOM_NODES);

