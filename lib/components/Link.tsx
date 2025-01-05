import { Link as LinkIcon } from "lucide-react";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { cn } from "@/lib/utils";
import { classNameDesc } from "./common";

export const LINK_TYPE = "Link";

export interface LinkProps {
    href: string;
    text: string;
    target: string;
    className?: string;
}

export function Node(props: LinkProps) {
    const baseClasses = "text-primary hover:text-primary/80 transition-colors duration-200";
    
    return (
        <a 
            href={props.href}
            target={props.target}
            rel={props.target === "_blank" ? "noopener noreferrer" : undefined}
            className={cn(baseClasses, props.className)}
        >
            {props.text}
        </a>
    );
}

const defaultProps: LinkProps = {
    href: "#",
    text: "Click here",
    target: "_blank",
    className: "",
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
            default: "_blank",
        },
        className: classNameDesc, 
    }
};

export const desc: ComponentDescriptor = {
    id: "id",
    type: LINK_TYPE,
    name: "Link",
    icon: <LinkIcon className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: false,
    childrenDescriptors: [],
};

export default {
    type: LINK_TYPE,
    descriptor: desc,
    node: Node,
} as ComponentExport;
