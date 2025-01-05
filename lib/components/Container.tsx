import { Layout } from "lucide-react";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor, ComponentPropsWithChildren } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";

export const CONTAINER_TYPE = "Container";

export interface ContainerProps extends ComponentPropsWithChildren {
    maxWidth: string;
    padding: string;
    margin: string;
    customCss: string;
}

function Node(props: ContainerProps) {
    return (
        <div 
            style={{
                maxWidth: props.maxWidth,
                padding: props.padding,
                margin: props.margin,
                ...JSON.parse(props.customCss || '{}')
            }}
        >
            {props.children}
        </div>
    );
}

const defaultProps: ContainerProps = {
    maxWidth: "1200px",
    padding: "1rem",
    margin: "0 auto",
    customCss: "{}",
    children: [],
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Container",
    child: {
        maxWidth: {
            type: DataType.STRING,
            displayName: "Max Width",
            desc: "Maximum width of the container (e.g., 1200px, 80%, etc.)",
            input: InputType.TEXT,
            default: "1200px",
        },
        padding: {
            type: DataType.STRING,
            displayName: "Padding",
            desc: "Inner spacing (e.g., 1rem, 20px, etc.)",
            input: InputType.TEXT,
            default: "1rem",
        },
        margin: {
            type: DataType.STRING,
            displayName: "Margin",
            desc: "Outer spacing (e.g., 0 auto, 1rem, etc.)",
            input: InputType.TEXT,
            default: "0 auto",
        },
        customCss: {
            type: DataType.STRING,
            displayName: "Custom CSS",
            desc: "Additional CSS properties in JSON format (e.g., {\"backgroundColor\": \"#f0f0f0\"})",
            input: InputType.TEXTAREA,
            default: "{}",
        },
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: CONTAINER_TYPE,
    name: "Container",
    icon: <Layout className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: true,
    childrenDescriptors: [],
};

export default {
    type: CONTAINER_TYPE,
    descriptor: desc,
    node: Node,
} as ComponentExport;
