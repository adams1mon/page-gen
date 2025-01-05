import { LayoutGrid } from "lucide-react";
import { ComponentDescriptor, ComponentPropsWithChildren } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { cn } from "@/lib/utils";
import { alignItemsDesc, classNameDesc, justifyContentDesc } from "./common";

export const COLUMN_TYPE = "Column";

export interface ColumnProps extends ComponentPropsWithChildren {
    gap: string;
    alignItems: string;
    justifyContent: string;
    className?: string;
}

const baseClasses = "flex flex-col";
const gapClasses = {
    '1rem': 'gap-4',
    '0.5rem': 'gap-2',
    '2rem': 'gap-8',
};
const alignmentClasses = {
    'stretch': 'items-stretch',
    'center': 'items-center',
    'flex-start': 'items-start',
    'flex-end': 'items-end',
};
const justifyClasses = {
    'flex-start': 'justify-start',
    'center': 'justify-center',
    'flex-end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
};

function Node(props: ColumnProps) {
    return (
        <div
            className={cn(
                baseClasses,
                gapClasses[props.gap as keyof typeof gapClasses] || 'gap-4',
                alignmentClasses[props.alignItems as keyof typeof alignmentClasses] || 'items-stretch',
                justifyClasses[props.justifyContent as keyof typeof justifyClasses] || 'justify-start',
                props.className
            )}
        >
            {props.children}
        </div>
    );
}

const defaultProps: ColumnProps = {
    gap: "1rem",
    alignItems: "stretch",
    justifyContent: "flex-start",
    className: "",
    children: [],
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Column",
    desc: "Layout element which arranges child elements in a vertical order",
    child: {
        gap: {
            type: DataType.STRING,
            displayName: "Gap",
            desc: "Space between child elements",
            input: InputType.TEXT,
            default: "1rem",
        },
        alignItems: alignItemsDesc,
        justifyContent: justifyContentDesc,
        className: classNameDesc,
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: COLUMN_TYPE,
    name: "Column",
    icon: <LayoutGrid className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: true,
    childrenDescriptors: [],
};

export default {
    type: COLUMN_TYPE,
    descriptor: desc,
    node: Node,
} as ComponentExport;

