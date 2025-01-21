//import { Layout } from "lucide-react";
//import { LinkProps, desc as linkDescriptor, Node as linkNode } from "./Link";
//import { htmlIdDesc } from "./common";
//import { DataType, InputType, ObjectDesc } from "../../core/props/PropsDescriptor";
//import { ComponentDescriptor } from "../foo/ComponentDescriptor";
//import { createElement } from "react";
//import { ComponentExport } from "../foo/ComponentContainer";
//
//export const HEADER_TYPE = "Header";
//
//export interface HeaderProps {
//    title: string;
//    links: LinkProps[];
//    htmlId: string;
//}
//
//export function Node(props: HeaderProps) {
//    return (
//        <header id={props.htmlId} className="w-full py-6 px-8 bg-background border-t">
//            <div className="max-w-5xl mx-auto">
//                <div className="flex justify-between items-center">
//                    <h1 className="text-2xl font-bold">{props.title}</h1>
//                    <nav className="space-x-6">
//                        {props.links.map((link, index) => (
//
//                            createElement(linkNode, {...link, key: index})
//
//                            //<a key={index} href={link.url} className="text-muted-foreground hover:text-foreground">
//                            //    {link.text}
//                            //</a>
//                        ))}
//                    </nav>
//                </div>
//            </div>
//        </header>
//    );
//}
//
//const defaultProps: HeaderProps = {
//    title: "Your Name",
//    links: [
//        linkDescriptor.props,
//        //{ text: "About", url: "#about" },
//        //{ text: "Projects", url: "#projects" },
//        //{ text: "Contact", url: "#contact" }
//    ],
//    htmlId: "header"
//};
//
//
//const propsDescriptor: ObjectDesc = {
//    type: DataType.OBJECT,
//    displayName: "Header section",
//    child: {
//        title: {
//            type: DataType.STRING,
//            displayName: "Title",
//            desc: "Title to display in the header",
//            input: InputType.TEXT,
//            default: "Title",
//        },
//        links: {
//            type: DataType.ARRAY,
//            displayName: "Links",
//            desc: "Links to display in the header",
//            child: linkDescriptor.propsDescriptor
//        },
//        htmlId: { ...htmlIdDesc, default: "header", },
//    }
//}
//
//export const desc: ComponentDescriptor = {
//    id: "id",
//    type: HEADER_TYPE,
//    name: "Header",
//    props: defaultProps,
//    propsDescriptor,
//    icon: <Layout className="w-4 h-4" />,
//    acceptsChildren: false,
//    childrenDescriptors: [],
//}
//
//export default {
//    type: HEADER_TYPE,
//    descriptor: desc,
//    node: Node,
//} as ComponentExport;
