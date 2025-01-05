import { LayoutGrid } from "lucide-react";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor, ComponentPropsWithChildren } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";

export const COLUMN_TYPE = "Column";

export interface ColumnProps extends ComponentPropsWithChildren {
    gap: string;
    alignItems: string;
    justifyContent: string;
    customCss: string;
}

function Node(props: ColumnProps) {
    return (
        <div 
            style={{
                display: "flex",
                flexDirection: "column",
                gap: props.gap,
                alignItems: props.alignItems,
                justifyContent: props.justifyContent,
                ...JSON.parse(props.customCss || '{}')
            }}
        >
            {props.children}
        </div>
    );
}

const defaultProps: ColumnProps = {
    gap: "1rem",
    alignItems: "stretch",
    justifyContent: "flex-start",
    customCss: "{}",
    children: [],
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Column",
    desc: "Layout element which groups components in a vertical order",
    child: {
        gap: {
            type: DataType.STRING,
            displayName: "Gap",
            desc: "Space between child elements",
            input: InputType.TEXT,
            default: "1rem",
        },
        alignItems: {
            type: DataType.STRING,
            displayName: "Align Items",
            desc: "Horizontal alignment (stretch, center, flex-start, flex-end)",
            input: InputType.TEXT,
            default: "stretch",
        },
        justifyContent: {
            type: DataType.STRING,
            displayName: "Justify Content",
            desc: "Vertical alignment (flex-start, center, flex-end, space-between, space-around)",
            input: InputType.TEXT,
            default: "flex-start",
        },
        customCss: {
            type: DataType.STRING,
            displayName: "Custom CSS",
            desc: "Additional CSS properties in JSON format",
            input: InputType.TEXTAREA,
            default: "{}",
        },
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

