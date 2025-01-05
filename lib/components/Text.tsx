import { Type } from "lucide-react";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { customCssDesc, textAlignDesc } from "./styles/shared";

export const TEXT_TYPE = "Text";

export interface TextProps {
    content: string;
    fontSize: string;
    textAlign: string;
    customCss: string;
}

function Node(props: TextProps) {
    return (
        <p style={{
            fontSize: props.fontSize,
            textAlign: props.textAlign as any,
            ...JSON.parse(props.customCss || '{}')
        }}>
            {props.content}
        </p>
    );
}

const defaultProps: TextProps = {
    content: "Enter your text here",
    fontSize: "1rem",
    textAlign: "left",
    customCss: "{}",
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
            desc: "Size of the text (e.g., 1rem, 16px)",
            input: InputType.TEXT,
            default: "1rem",
        },
        textAlign: textAlignDesc,
        customCss: customCssDesc,
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
