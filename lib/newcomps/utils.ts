import { Component } from "./Heading";
import { Page } from "./Page";

function addSibling(reference: Component, child: Component, position: 'before' | 'after') {

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
