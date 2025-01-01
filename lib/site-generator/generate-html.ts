import { renderToStaticMarkup } from "react-dom/server";
import { ComponentContainer, ComponentDescriptor, NestedComponentsProps } from "../components/ComponentContainer";
import React, { FunctionComponentElement, createElement } from "react";
import { SITE_TYPE } from "../components/Site";

export function newSite(): ComponentDescriptor {
    return ComponentContainer.createInstance(SITE_TYPE);
}

export function createReactNode(comp: ComponentDescriptor): FunctionComponentElement<any> {
    // assign the 'id' of the component to the React 'key' prop
    return createElement(comp.jsxFunc, { ...comp.props, key: comp.id });
}

export async function generateHtml(comp: ComponentDescriptor) {
    const element = createReactNode(comp);
    const html = renderToStaticMarkup(element);
    return html;
}

export function nestComponents(props: NestedComponentsProps): FunctionComponentElement<any> {
    return createElement(
        React.Fragment,
        null,

        // add 'key' prop to every child
        ...props.children.map(c => createElement(c.jsxFunc, { ...c.props, key: c.id }))
    );
}

