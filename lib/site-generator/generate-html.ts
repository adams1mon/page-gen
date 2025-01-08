import { renderToStaticMarkup } from "react-dom/server";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { ReactElement, createElement } from "react";
import { SITE_TYPE, SiteProps } from "../components/Site";
import { ComponentContainer } from "../components-meta/ComponentContainer";

// Import all the generated CSS files used by the application,
// use it for the generated site as well.

// @ts-ignore
import pageCss from '!!css-loader?{"sourceMap":false,"url":false,"exportType":"string"}!../../.next/static/css/app/page.css';

// @ts-ignore
import layoutCss from '!!css-loader?{"sourceMap":false,"url":false,"exportType":"string"}!../../.next/static/css/app/layout.css';

export function newSite(): ComponentDescriptor {

    const site = ComponentContainer.createInstance(SITE_TYPE);

    // initialize the Site props with the css

    // merge the generated CSS files
    const css = layoutCss + "\n" + pageCss;
    (site.props as SiteProps).styles = css;

    return site;
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

