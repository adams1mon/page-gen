import { Link as LinkIcon } from "lucide-react";
import { ComponentContainer } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { customCssDesc } from "./styles/shared";

export const LINK_TYPE = "Link";

export interface LinkProps {
    href: string;
    text: string;
    target: string;
    customCss: string;
}

function Node(props: LinkProps) {
    return (
        <a 
            href={props.href}
            target={props.target}
            rel={props.target === "_blank" ? "noopener noreferrer" : undefined}
            style={{
                textDecoration: "none",
                ...JSON.parse(props.customCss || '{}')
            }}
        >
            {props.text}
        </a>
    );
}

const defaultProps: LinkProps = {
    href: "#",
    text: "Click here",
    target: "_self",
    customCss: "{}",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Link",
    child: {
        href: {
            type: DataType.STRING,
            displayName: "URL",
            desc: "Link destination",
            input: InputType.URL,
            default: "#",
        },
        text: {
            type: DataType.STRING,
            displayName: "Text",
            desc: "Link text",
            input: InputType.TEXT,
            default: "Click here",
        },
        target: {
            type: DataType.STRING,
            displayName: "Target",
            desc: "Where to open the link (_self, _blank)",
            input: InputType.TEXT,
            default: "_self",
        },
        ...customCssDesc,
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: LINK_TYPE,
    name: "Link",
    icon: <LinkIcon className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: false,
    childrenDescriptors: [],
};

ComponentContainer.save(LINK_TYPE, desc, Node);