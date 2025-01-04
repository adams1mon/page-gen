import { Heading1 } from "lucide-react";
import { ComponentContainer } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { customCssDesc, textAlignDesc } from "./styles/shared";

export const HEADING_TYPE = "Heading";

export interface HeadingProps {
    content: string;
    level: string;
    textAlign: string;
    customCss: string;
}

function Node(props: HeadingProps) {
    const Tag = `h${props.level}` as keyof JSX.IntrinsicElements;
    
    return (
        <Tag style={{
            textAlign: props.textAlign as any,
            ...JSON.parse(props.customCss || '{}')
        }}>
            {props.content}
        </Tag>
    );
}

const defaultProps: HeadingProps = {
    content: "Heading",
    level: "1",
    textAlign: "left",
    customCss: "{}",
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
        textAlign,
        customCss,
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

ComponentContainer.save(HEADING_TYPE, desc, Node);