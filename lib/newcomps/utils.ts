import { Page } from "./Page";
import { ComponentWrapper } from "./types";

export function findByIdInComp(comp: ComponentWrapper, id: string): ComponentWrapper | null {
    if (comp.id == id) return comp;

    if (!comp.children) return null;

    for (const child of comp.children) {
        const node = findByIdInComp(child, id);
        if (node) return node;
    }

    return null;
}

export function addSibling(
    reference: ComponentWrapper,
    compToAdd: ComponentWrapper,
    position: 'before' | 'after',
) {
    if (!reference.parent || !reference.parent.children) return;

    let refIndex = reference.parent.children.findIndex(c => c.id === reference.id);
    if (refIndex === -1) return;

    if (position == 'before') {
        reference.htmlElement.insertAdjacentElement('beforebegin', compToAdd.htmlElement);
    } else if (position == 'after') {
        reference.htmlElement.insertAdjacentElement('afterend', compToAdd.htmlElement);
        refIndex++;
    }

    // update children array
    reference.parent.children.splice(refIndex, 0, compToAdd);

    // update parent
    compToAdd.parent = reference.parent;

    console.log("DOM: added sibling", compToAdd, " to reference", reference, position);
}

export function addChild(parent: ComponentWrapper | Page, child: ComponentWrapper, index?: number) {
    if (!parent.children) return;

    if (index && index > -1 && index < parent.children.length) {
        parent.children.splice(index, 0, child);
        const node = parent.htmlElement.childNodes.item(index);

        // TODO: fix bug 
        // Try to insert more elements into a Row and sometimes it happens.
        // NotFoundError: Node.insertBefore: Child to insert before is not a child of this node
        node.insertBefore(child.htmlElement, node);
    } else {
        parent.children.push(child);
        parent.htmlElement.appendChild(child.htmlElement);
    }

    child.parent = parent;
}

export function removeChild(parent: ComponentWrapper | Page, child: ComponentWrapper) {
    if (!parent.children) return;

    parent.children = parent.children.filter(c => c.id !== child.id);
    child.htmlElement.remove();
}

export function createId(type: string): string {
    return `${type}-${Date.now()}`;
}