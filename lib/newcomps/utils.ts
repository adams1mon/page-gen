import { Page } from "./Page";
import { ChildrenContainer, Component } from "./types";

export function findByIdInPage(page: Page, id: string): Component | null {

    for (const child of page.children as Component[]) {
        const node = findByIdInComp(child, id);
        if (node) return node;
    }

    return null;
}

export function findByIdInComp(root: Component, id: string): Component | null {
    if (root.id == id) return root;

    if ("children" in root) {
        for (const child of root.children as Component[]) {
            const node = findByIdInComp(child, id);
            if (node) return node;
        }
    }

    return null;
}

export function updateComp(child: Component, props: any) {
    child.props = props;

    // TODO: do some DOM surgery to set the parent to the previous one's, etc.
    const newNode = child.createHtmlElement();
    child.htmlElement.replaceWith(newNode);
    child.htmlElement = newNode;
}

export function addChild(root: ChildrenContainer, child: Component, index?: number) {
    if (index && index > -1 && index < root.children.length) {
        root.children.splice(index, 0, child);
        const node = root.htmlElement.childNodes.item(index);
        node.insertBefore(child.htmlElement, node);
    } else {
        root.children.push(child);
        root.htmlElement.appendChild(child.htmlElement);
    }

    child.parent = root;
}

export function addSibling(
    reference: Component,
    child: Component,
    position: 'before' | 'after',
) {
    if (!reference.parent) return;

    let refIndex = reference.parent.children.findIndex(c => c.id === reference.id);
    if (refIndex === -1) return;

    if (position == 'before') {
        reference.htmlElement.insertAdjacentElement('beforebegin', child.htmlElement);
    } else if (position == 'after') {
        reference.htmlElement.insertAdjacentElement('afterend', child.htmlElement);
        refIndex++;
    }

    // update children array
    reference.parent.children.splice(refIndex, 0, child);

    // update parent
    child.parent = reference.parent;

    console.log("DOM: added sibling", child, " to reference", reference, position);
}

export function createId(type: string): string {
    return `${type}-${Date.now()}`;
}
