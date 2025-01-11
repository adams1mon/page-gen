import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor, ComponentPropsWithChildren } from "../components-meta/ComponentDescriptor";
import { DataType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { titleDesc, longTextDesc, textDesc } from "./common";

// Import the Tailwind generated styles
// @ts-ignore
//import css from '!!raw-loader!../generated/styles.css';
//
import globals_css from '!!raw-loader!../styles/globals.css';
import tailwind_js from '!!raw-loader!../styles/tailwind_3.4.16.js';
import tailwind_config from '!!raw-loader!../styles/tailwind.config.js';

export const SITE_TYPE = "Site";

export interface SiteProps extends ComponentPropsWithChildren {
    title: string;
    description: string;
    styles?: string;
}

const tag = (name: string, obj?: { [key: string]: string }) => {
    const m = document.createElement(name);
    for (const key in obj) {
        m.setAttribute(key, obj[key]);
    }
    return m;
}

export function createHtmlSkeleton(): HTMLElement {

    const html = document.createElement("html");
    const head = document.createElement("head");
    const body = document.createElement("body");

    head.appendChild(tag("meta", { charSet: "UTF-8" }));
    head.appendChild(tag("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }));
    head.appendChild(tag("meta", { name: "description", content: "desc" }));

    //<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"></script>
    //const tailwind_tag = tag("script", {"src": "https://cdn.tailwindcss.com"});
    //tailwind_tag.innerText = tailwind_js;
    //head.appendChild(tailwindTag());

    const styles = tag("style");
    styles.textContent = globals_css;

    head.appendChild(styles);

    html.appendChild(head);
    html.appendChild(body);

    console.log(html.outerHTML);

    return html;
}

export function tailwindTag() {
    const tailwind_tag = tag("script");
    tailwind_tag.textContent = tailwind_js;
    return tailwind_tag;
}

export function setBodyHtml(root: HTMLElement, htmlStr: string) {
    const body = root.querySelector("body");
    if (body) {
        body.innerHTML = htmlStr;
    }
}

export function upsertHtmlNode(root: HTMLElement, html: HTMLElement) {
    const prevHtml = root.querySelector("html");
    if (prevHtml) {
        root.replaceChild(html, prevHtml);
    } else {
        root.appendChild(html);
    }
}

function Node(props: SiteProps) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={props.description} />
                {props.styles && <style dangerouslySetInnerHTML={{
                    __html: props.styles
                }}
                ></style>}
                <title>{props.title}</title>
            </head>
            <body>
                {
                    props.children
                }
            </body>
        </html>
    );
}

const defaultProps: SiteProps = {
    title: 'My Portfolio',
    description: 'Welcome to my portfolio website',

    // NOTE: The site uses the same Tailwind generated CSS the main page uses.
    // The styles are overwritten by the generated Tailwind CSS file, 
    // see how a new site is created in generate-html.
    //styles: css,
    children: [],
};

// NOTE: include only the properties which should be editable by the user.
// Add the immutable properties to the defaultProps object.
const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Site settings",
    child: {
        title: {
            ...titleDesc,
            desc: "Title of the website, displayed in the browser window.",
            default: "My Portfolio",
        },
        description: {
            ...textDesc,
            desc: "Description of the website, useful for Search Engine Optimization (SEO). Displayed in a <meta> tag.",
            default: "Personal portfolio website showcasing my projects",
        },
        styles: {
            ...longTextDesc,
            displayName: "Custom CSS styles",
            desc: "Custom CSS styles to include in a <style> in the website",
            //default: css,
            default: "",
        },
    }
};

const desc: ComponentDescriptor = {
    id: "site-id",
    type: SITE_TYPE,
    name: "Site",
    props: defaultProps,
    propsDescriptor,
    icon: null,
    acceptsChildren: true,
    childrenDescriptors: [],
}

export default {
    type: SITE_TYPE,
    descriptor: desc,
    node: Node,
} as ComponentExport;
