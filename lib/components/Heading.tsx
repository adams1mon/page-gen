import { Heading1 } from "lucide-react";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { cn } from "@/lib/utils";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { classNameDesc } from "./common";

export const HEADING_TYPE = "Heading";

export interface HeadingProps {
    content: string;
    level: string;
    textAlign: string;
    className?: string;
}

function createHtmlNode(props: HeadingProps) {

    const baseClasses = ["font-bold", "text-foreground"];
    const alignmentClasses = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    };
    const levelClasses = {
        '1': ['text-4xl', 'mb-6'],
        '2': ['text-3xl', 'mb-5'],
        '3': ['text-2xl', 'mb-4'],
        '4': ['text-xl', 'mb-3'],
        '5': ['text-lg', 'mb-2'],
        '6': ['text-base', 'mb-2']
    };

    const tag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;
    const h = document.createElement(tag);

    h.classList.add(
        ...baseClasses,
        ...levelClasses[props.level as keyof typeof levelClasses || '1'],
        alignmentClasses[props.textAlign as keyof typeof alignmentClasses || 'left'],
    );

    props.className && h.classList.add(...props.className.split(" "));

    h.innerText = props.content;

    return h;
    //
    //return (
    //    <Tag className={cn(
    //        baseClasses,
    //        levelClasses[props.level as keyof typeof levelClasses] || 'text-4xl',
    //        alignmentClasses[props.textAlign as keyof typeof alignmentClasses] || 'text-left',
    //        props.className
    //    )}>
    //        {props.content}
    //    </Tag>
    //);
}

function Node(props: HeadingProps) {
    const Tag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;

    const baseClasses = "font-bold text-foreground";
    const alignmentClasses = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    };
    const levelClasses = {
        '1': 'text-4xl mb-6',
        '2': 'text-3xl mb-5',
        '3': 'text-2xl mb-4',
        '4': 'text-xl mb-3',
        '5': 'text-lg mb-2',
        '6': 'text-base mb-2'
    };

    return (
        <Tag className={cn(
            baseClasses,
            levelClasses[props.level as keyof typeof levelClasses] || 'text-4xl',
            alignmentClasses[props.textAlign as keyof typeof alignmentClasses] || 'text-left',
            props.className
        )}>
            {props.content}
        </Tag>
    );
}

const defaultProps: HeadingProps = {
    content: "Heading",
    level: "1",
    textAlign: "left",
    className: "",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Heading",
    child: {
        content: {
            type: DataType.STRING,
            displayName: "Content",
            desc: "Heading text",
            input: InputType.TEXT,
            default: "Heading",
        },
        level: {
            type: DataType.STRING,
            displayName: "Level",
            desc: "Heading level (1-6)",
            input: InputType.TEXT,
            default: "1",
        },
        textAlign: {
            type: DataType.STRING,
            displayName: "Text Align",
            desc: "Text alignment (left, center, right)",
            input: InputType.TEXT,
            default: "left",
        },
        className: classNameDesc,
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: HEADING_TYPE,
    name: "Heading",
    icon: <Heading1 className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: false,
    childrenDescriptors: [],
};

export default {
    type: HEADING_TYPE,
    descriptor: desc,
    //node: Node,
    createHtmlNode,
} as ComponentExport;
