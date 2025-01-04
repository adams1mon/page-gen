import { renderToStaticMarkup } from "react-dom/server";
import { ComponentContainer, ComponentDescriptor } from "../components/ComponentContainer";
import { ReactElement, createElement } from "react";
import { SITE_TYPE } from "../components/Site";

export function newSite(): ComponentDescriptor {
    return ComponentContainer.createInstance(SITE_TYPE);
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

