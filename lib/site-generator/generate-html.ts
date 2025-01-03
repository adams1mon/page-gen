import { renderToStaticMarkup } from "react-dom/server";
import { ComponentContainer, ComponentDescriptor } from "../components/ComponentContainer";
import { FunctionComponentElement, createElement } from "react";
import { SITE_TYPE } from "../components/Site";

export function newSite(): ComponentDescriptor {
    return ComponentContainer.createInstance(SITE_TYPE);
}

export function createReactNode(comp: ComponentDescriptor): FunctionComponentElement<any> {

    // generate child components recursively if there are child descriptors
    if (comp.props?.childrenDesc && comp.props.childrenDesc.length > 0) {
        console.log(comp.props.childrenDesc);

        comp.props = {
            ...comp.props,

            // adds the 'key' prop to the created elements
            children: (comp.props.childrenDesc as ComponentDescriptor[])
                .map(c => createElement(c.jsxFunc, { ...c.props, key: c.id }))
        };
    }

    // assign the 'id' of the component to the React 'key' prop
    return createElement(comp.jsxFunc, { ...comp.props, key: comp.id });
}

export async function generateHtml(comp: ComponentDescriptor) {
    const element = createReactNode(comp);
    const html = renderToStaticMarkup(element);
    return html;
}

