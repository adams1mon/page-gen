import { renderToStaticMarkup } from "react-dom/server";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DOMElement, ReactElement, createElement } from "react";
import { SITE_TYPE, createHtmlSkeleton, setBodyHtml } from "../components/Site";
import { ComponentContainer } from "../components-meta/ComponentContainer";

export function newSite(): ComponentDescriptor {
    return ComponentContainer.createInstance(SITE_TYPE);
} 

export function createDOMTree(comp: ComponentDescriptor): DOMElement {

}

export function createHtml(comp: ComponentDescriptor): HTMLElement {
    const html = createHtmlSkeleton();

    let htmlStr;
    if (comp.acceptsChildren) {
        const children = comp.childrenDescriptors.map(createReactNode)
        htmlStr = children.map(renderToStaticMarkup).join("\n");
    } else {
        htmlStr = renderToStaticMarkup(createReactNode(comp));
    }

    setBodyHtml(html, htmlStr);
    return html;
}

export function createReactNode(comp: ComponentDescriptor): ReactElement {

    // generate child components recursively if there are child descriptors
    if (hasChildren(comp)) {
        comp.props = {
            ...comp.props,

            children: (comp.childrenDescriptors as ComponentDescriptor[])
                .map(createReactNode)
        };
    }

    // adds the 'key' prop to the created elements
    return createElement(
        ComponentContainer.getReactElement(comp.type),
        { ...comp.props, key: comp.id },
    );
}

export function hasChildren(comp: ComponentDescriptor): boolean {
    return comp.acceptsChildren
        && comp.childrenDescriptors
        && comp.childrenDescriptors.length > 0;
}

export async function generateHtml(comp: ComponentDescriptor) {
    const element = createReactNode(comp);
    const html = renderToStaticMarkup(element);
    return html;
}

