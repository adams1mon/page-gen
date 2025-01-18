//import { ComponentDesc, ComponentInstance, HEADING_TYPE } from "./Heading";
//import { ChildrenContainer, Page, createId } from "./Page";
import { compMap } from "./available-comps";
import { Component, ComponentWithChildren } from "./types";

//export function findByIdInPage(page: Page, id: string): Component | null {
//
//    for (const child of page.children as Component[]) {
//        const node = findByIdInComp(child, id);
//        if (node) return node;
//    }
//
//    return null;
//}
//
//export function findByIdInComp(root: Component, id: string): Component | null {
//    if (root.id == id) return root;
//
//    if ("children" in root) {
//        for (const child of root.children as Component[]) {
//            const node = findByIdInComp(child, id);
//            if (node) return node;
//        }
//    }
//
//    return null;
//}
//
//export function updateComp(child: Component, props: any) {
//    child.props = props;
//    const newNode = child.createHtmlElement();
//    child.htmlElement.replaceWith(newNode);
//    child.htmlElement = newNode;
//}
//
//export function addChild(root: ChildrenContainer, child: Component, index?: number) {
//    if (index && index > -1 && index < root.children.length) {
//        root.children.splice(index, 0, child);
//        const node = root.domNode.childNodes.item(index);
//        node.insertBefore(node, child.htmlElement);
//    } else {
//        root.children.push(child);
//        root.domNode.appendChild(child.htmlElement);
//    }
//
//    child.parent = root;
//}
//
//export function addSibling(
//    reference: Component,
//    child: Component,
//    position: 'before' | 'after',
//) {
//    if (!reference.parent) return;
//
//    let refIndex = reference.parent.children.findIndex(c => c.id === reference.id);
//    if (refIndex === -1) return;
//
//    if (position == 'before') {
//        reference.htmlElement.insertAdjacentElement('beforebegin', child.htmlElement);
//    } else if (position == 'after') {
//        reference.htmlElement.insertAdjacentElement('afterend', child.htmlElement);
//        refIndex++;
//    }
//
//    // update children array
//    reference.parent.children.splice(refIndex, 0, child);
//
//    // update parent
//    child.parent = reference.parent;
//
//    console.log("DOM: added sibling", child, " to reference", reference, position);
//}
//
//export function removeChild(root: ChildrenContainer, child: Component) {
//    root.children = root.children.filter(c => c.id !== child.id);
//    child.htmlElement.remove();
//}


export function createId(type: string): string {
    return `${type}-${Date.now()}`;
}

export function create(componentType: string, props?: any, parent?: ComponentWithChildren): Component {
    const desc = compMap[componentType];
    const id = createId(desc.type);
    const htmlElement = desc.createHtmlElement(props ?? desc.defaultProps);
    htmlElement.setAttribute("data-id", id);

    return {
        ...desc,
        id,
        defaultProps: props ?? desc.defaultProps,
        htmlElement,
        parent,
    };
}

export function clone(comp: Component): Component { 
    const id = createId(comp.type);

    const htmlElement = comp.createHtmlElement(comp.defaultProps);
    htmlElement.setAttribute("data-id", id);

    return {
        ...comp,
        id,
        htmlElement,
    }
}

export function remove(comp: Component) {
    comp.htmlElement.remove();

    if (comp.parent) { 
        const index = comp.parent.children.findIndex(c => c.id === comp.id);
        if (index > -1) {
            comp.parent.children.splice(index, 1);
        }
    }
}

