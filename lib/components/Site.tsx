//import { ComponentExport } from "../foo/ComponentContainer";
//import { ComponentDescriptor, ComponentPropsWithChildren } from "../foo/ComponentDescriptor";
//import { DataType, ObjectDesc } from "../../core/props/PropsDescriptor";
//import { titleDesc, longTextDesc, textDesc } from "./common";
//
//// Import the Tailwind generated styles
//// @ts-ignore
//import css from '!!raw-loader!../generated/styles.css';
//
//
//export const SITE_TYPE = "Site";
//
//export interface SiteProps extends ComponentPropsWithChildren {
//    title: string;
//    description: string;
//    styles?: string;
//}
//
//export function tag(name: string, obj?: { [key: string]: string }) {
//    const m = document.createElement(name);
//    for (const key in obj) {
//        m.setAttribute(key, obj[key]);
//    }
//    return m;
//}
//
//export function createSiteSkeleton(props: SiteProps = defaultProps): HTMLElement {
//    const html = tag("html");
//
//    const head = tag("head");
//    head.appendChild(tag("meta", { charSet: "UTF-8" }));
//    head.appendChild(tag("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }));
//    head.appendChild(tag("meta", { name: "description", content: props.description }));
//
//    const title = tag("title");
//    title.textContent = props.title;
//    head.appendChild(title);
//
//    const styles = tag("style");
//    styles.textContent = props.styles ?? css;
//    head.appendChild(styles);
//
//    html.appendChild(head);
//
//    const body = tag("body");
//    html.appendChild(body);
//
//    return body;
//}
//
//export function upsertNode(query: string, root: HTMLElement | ShadowRoot, newNode: HTMLElement) {
//    const prev = root.querySelector(query);
//    if (prev) {
//        root.replaceChild(newNode, prev);
//    } else {
//        root.appendChild(newNode);
//    }
//}
//
////function Node(props: SiteProps) {
////    return (
////        <html lang="en">
////            <head>
////                <meta charSet="UTF-8" />
////                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
////                <meta name="description" content={props.description} />
////                {props.styles && <style dangerouslySetInnerHTML={{
////                    __html: props.styles
////                }}
////                ></style>}
////                <title>{props.title}</title>
////            </head>
////            <body>
////                {
////                    props.children
////                }
////            </body>
////        </html>
////    );
////}
//
//const defaultProps: SiteProps = {
//    title: 'My Portfolio',
//    description: 'Welcome to my portfolio website',
//
//    // NOTE: The site uses the same Tailwind generated CSS the main page uses.
//    // The styles are overwritten by the generated Tailwind CSS file, 
//    // see how a new site is created in generate-html.
//    styles: css,
//    children: [],
//};
//
//// NOTE: include only the properties which should be editable by the user.
//// Add the immutable properties to the defaultProps object.
//const propsDescriptor: ObjectDesc = {
//    type: DataType.OBJECT,
//    displayName: "Site settings",
//    child: {
//        title: {
//            ...titleDesc,
//            desc: "Title of the website, displayed in the browser window.",
//            default: "My Portfolio",
//        },
//        description: {
//            ...textDesc,
//            desc: "Description of the website, useful for Search Engine Optimization (SEO). Displayed in a <meta> tag.",
//            default: "Personal portfolio website showcasing my projects",
//        },
//        styles: {
//            ...longTextDesc,
//            displayName: "Custom CSS styles",
//            desc: "Custom CSS styles to include in a <style> in the website",
//            default: css,
//        },
//    }
//};
//
//const desc: ComponentDescriptor = {
//    id: "site-id",
//    type: SITE_TYPE,
//    name: "Site",
//    props: defaultProps,
//    propsDescriptor,
//    icon: null,
//    acceptsChildren: true,
//    childrenDescriptors: [],
//}
//
//export default {
//    type: SITE_TYPE,
//    descriptor: desc,
//    createHtmlNode: createSiteSkeleton,
//} as ComponentExport;
