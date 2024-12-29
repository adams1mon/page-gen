import { renderToStaticMarkup } from "react-dom/server";
import { ComponentContainer, ComponentDescriptor } from "../components/ComponentContainer";
import { createElement } from "react";
import { SITE_TYPE } from "../components/Site";

export function newSite(): ComponentDescriptor {
    return ComponentContainer.createInstance(SITE_TYPE);
}

export async function generateHtml(site: ComponentDescriptor) {
    // assign the 'id' of the component to the React 'key' prop
    const siteNode = createElement(site.jsxFunc, { ...site.props, key: site.id });
    const html = renderToStaticMarkup(siteNode);

    return html;
}

