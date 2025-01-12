import { renderToStaticMarkup } from "react-dom/server";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { ReactElement, createElement } from "react";
import { SITE_TYPE } from "../components/Site";
import { ComponentContainer } from "../components-meta/ComponentContainer";

export function newSite(): ComponentDescriptor {
    return ComponentContainer.createInstance(SITE_TYPE);
} 


//export function createHtml(comp: ComponentDescriptor): HTMLElement {
//    //const html = createHtmlSkeleton();
//    //setBodyHtml(html, renderToHtml(comp));
//    //return html;
//}

export function renderToHtml(comp: ComponentDescriptor): string {
    return ComponentContainer.htmlFuncs[comp.type](comp.props).outerHTML;
}

//export function renderToHtml(comp: ComponentDescriptor): string {
//    if (comp.acceptsChildren) {
//        const children = comp.childrenDescriptors.map(createReactNode);
//        return children.map(renderToStaticMarkup).join("\n");
//    } 
//
//    return renderToStaticMarkup(createReactNode(comp));
//}

//export function createReactNode(comp: ComponentDescriptor): ReactElement {
//
//    // generate child components recursively if there are child descriptors
//    if (hasChildren(comp)) {
//        comp.props = {
//            ...comp.props,
//
//            children: (comp.childrenDescriptors as ComponentDescriptor[])
//                .map(createReactNode)
//        };
//    }
//
//    // adds the 'key' prop to the created elements
//    return createElement(
//        ComponentContainer.getReactElement(comp.type),
//        { ...comp.props, key: comp.id },
//    );
//}

//export function hasChildren(comp: ComponentDescriptor): boolean {
//    return comp.acceptsChildren
//        && comp.childrenDescriptors
//        && comp.childrenDescriptors.length > 0;
//}

//export async function generateHtml(comp: ComponentDescriptor) {
//    const element = createReactNode(comp);
//    const html = renderToStaticMarkup(element);
//    return html;
//}

