import { LayoutGrid } from "lucide-react";
import { ComponentContainer } from "../components-meta/ComponentContainer";
import { ComponentDescriptor, ComponentPropsWithChildren } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";

export const ROW_TYPE = "Row";

export interface RowProps extends ComponentPropsWithChildren {
    gap: string;
    alignItems: string;
    justifyContent: string;
    customCss: string;
}

function Node(props: RowProps) {
    return (
        <div 
            style={{
                display: "flex",
                flexDirection: "row",
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

const defaultProps: RowProps = {
    gap: "1rem",
    alignItems: "center",
    justifyContent: "flex-start",
    customCss: "{}",
    children: [],
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Row",
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
            desc: "Vertical alignment (center, flex-start, flex-end, stretch)",
            input: InputType.TEXT,
            default: "center",
        },
        justifyContent: {
            type: DataType.STRING,
            displayName: "Justify Content",
            desc: "Horizontal alignment (flex-start, center, flex-end, space-between, space-around)",
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
    type: ROW_TYPE,
    name: "Row",
    icon: <LayoutGrid className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: true,
    childrenDescriptors: [],
};

ComponentContainer.save(ROW_TYPE, desc, Node);