//import { List as ListIcon } from "lucide-react";
//import { ComponentExport } from "../foo/ComponentContainer";
//import { ComponentDescriptor } from "../foo/ComponentDescriptor";
//import { DataType, InputType, ObjectDesc } from "../../core/props/PropsDescriptor";
//import { cn } from "@/lib/utils";
//import { classNameDesc } from "./common";
//
//export const LIST_TYPE = "List";
//
//export interface ListProps {
//    items: string[];
//    type: string;
//    className?: string;
//}
//
//function Node(props: ListProps) {
//    const ListTag = props.type === "ordered" ? "ol" : "ul";
//
//    return (
//        <ListTag
//            className={cn("pl-6", props.className)}
//        >
//            {props.items.map((item, index) => (
//                <li key={index}>{item}</li>
//            ))}
//        </ListTag>
//    );
//}
//
//const defaultProps: ListProps = {
//    items: ["First item", "Second item", "Third item"],
//    type: "unordered",
//    className: "",
//};
//
//const propsDescriptor: ObjectDesc = {
//    type: DataType.OBJECT,
//    displayName: "List",
//    child: {
//        items: {
//            type: DataType.ARRAY,
//            displayName: "List Items",
//            child: {
//                type: DataType.STRING,
//                displayName: "Item",
//                desc: "List item text",
//                input: InputType.TEXT,
//                default: "List item",
//            },
//        },
//        type: {
//            type: DataType.STRING,
//            displayName: "List Type",
//            desc: "Type of list (ordered, unordered)",
//            input: InputType.TEXT,
//            default: "unordered",
//        },
//        className: classNameDesc,
//    },
//};
//
//const desc: ComponentDescriptor = {
//    id: "id",
//    type: LIST_TYPE,
//    name: "List",
//    icon: <ListIcon className="w-4 h-4" />,
//    props: defaultProps,
//    propsDescriptor,
//    acceptsChildren: false,
//    childrenDescriptors: [],
//};
//
//export default {
//    type: LIST_TYPE,
//    descriptor: desc,
//    node: Node,
//} as ComponentExport;
//
