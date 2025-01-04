import { List as ListIcon } from "lucide-react";
import { ComponentContainer } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { customCssDesc } from "./styles/shared";

export const LIST_TYPE = "List";

export interface ListProps {
    items: string[];
    type: string;
    customCss: string;
}

function Node(props: ListProps) {
    const ListTag = props.type === "ordered" ? "ol" : "ul";
    
    return (
        <ListTag
            style={{
                paddingLeft: "1.5rem",
                ...JSON.parse(props.customCss || '{}')
            }}
        >
            {props.items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ListTag>
    );
}

const defaultProps: ListProps = {
    items: ["First item", "Second item", "Third item"],
    type: "unordered",
    customCss: "{}",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "List",
    child: {
        items: {
            type: DataType.ARRAY,
            displayName: "List Items",
            child: {
                type: DataType.STRING,
                displayName: "Item",
                desc: "List item text",
                input: InputType.TEXT,
                default: "List item",
            }
        },
        type: {
            type: DataType.STRING,
            displayName: "List Type",
            desc: "Type of list (ordered, unordered)",
            input: InputType.TEXT,
            default: "unordered",
        },
        customCssDesc,
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: LIST_TYPE,
    name: "List",
    icon: <ListIcon className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: false,
    childrenDescriptors: [],
};

ComponentContainer.save(LIST_TYPE, desc, Node);