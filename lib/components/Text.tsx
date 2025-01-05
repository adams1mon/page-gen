import { Type } from "lucide-react";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { cn } from "@/lib/utils";

export const TEXT_TYPE = "Text";

export interface TextProps {
    content: string;
    fontSize: string;
    textAlign: string;
    className?: string;
}

function Node(props: TextProps) {
    const baseClasses = "text-foreground";
    const alignmentClasses = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right',
        'justify': 'text-justify'
    };
    const sizeClasses = {
        '1rem': 'text-base',
        '0.875rem': 'text-sm',
        '1.125rem': 'text-lg',
        '1.25rem': 'text-xl',
        '1.5rem': 'text-2xl'
    };

    return (
        <p className={cn(
            baseClasses,
            alignmentClasses[props.textAlign as keyof typeof alignmentClasses] || 'text-left',
            sizeClasses[props.fontSize as keyof typeof sizeClasses] || 'text-base',
            props.className
        )}>
            {props.content}
        </p>
    );
}

const defaultProps: TextProps = {
    content: "Enter your text here",
    fontSize: "1rem",
    textAlign: "left",
    className: "",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Text",
    child: {
        content: {
            type: DataType.STRING,
            displayName: "Content",
            desc: "Text content to display",
            input: InputType.TEXTAREA,
            default: "Enter your text here",
        },
        fontSize: {
            type: DataType.STRING,
            displayName: "Font Size",
            desc: "Size of the text (1rem, 0.875rem, 1.125rem, 1.25rem, 1.5rem)",
            input: InputType.TEXT,
            default: "1rem",
        },
        textAlign: {
            type: DataType.STRING,
            displayName: "Text Align",
            desc: "Text alignment (left, center, right, justify)",
            input: InputType.TEXT,
            default: "left",
        },
        className: {
            type: DataType.STRING,
            displayName: "Custom Classes",
            desc: "Additional Tailwind classes",
            input: InputType.TEXT,
            default: "",
        }
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: TEXT_TYPE,
    name: "Text",
    icon: <Type className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: false,
    childrenDescriptors: [],
};

export default {
    type: TEXT_TYPE,
    descriptor: desc,
    node: Node,
} as ComponentExport;