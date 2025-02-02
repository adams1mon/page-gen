//import { Mail } from "lucide-react";
//import { htmlIdDesc } from "./common";
//import { ComponentDescriptor } from "../foo/ComponentDescriptor";
//import { DataType, InputType, ObjectDesc } from "../../core/props/PropsDescriptor";
//import { LinkProps, desc as linkDescriptor, Node as linkNode } from "./Link";
//import { createElement } from "react";
//import { ComponentExport } from "../foo/ComponentContainer";
//
//export const FOOTER_TYPE = "Footer";
//
//export interface FooterProps {
//    email: string;
//    socialLinks: LinkProps[];
//    htmlId: string;
//}
//
//function Node(props: FooterProps) {
//    return (
//        <footer id={props.htmlId} className="w-full py-12 bg-background border-t">
//            <div className="max-w-5xl mx-auto px-8">
//                <div className="grid md:grid-cols-2 gap-8">
//                    <div>
//                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
//                        <p className="text-muted-foreground">{props.email}</p>
//                    </div>
//                    <div>
//                        <h3 className="text-lg font-semibold mb-4">Social</h3>
//                        <div className="space-y-2">
//                            {props.socialLinks.map((link, index) => (
//
//                                createElement(linkNode, {...link, key: index})
//                                //<a
//                                //    key={link.url}
//                                //    href={link.url}
//                                //    target="_blank"
//                                //    rel="noopener noreferrer"
//                                //    className="block text-muted-foreground hover:text-foreground">
//                                //    {link.text}
//                                //</a>
//                            ))}
//                        </div>
//                    </div>
//                </div>
//            </div>
//        </footer>
//    );
//}
//
//const defaultProps: FooterProps = {
//    email: "email@example.com",
//    socialLinks: [
//        linkDescriptor.props,
//        //{ text: "GitHub", url: "https://github.com" },
//        //{ text: "LinkedIn", url: "https://linkedin.com" },
//        //{ text: "Twitter", url: "https://twitter.com" }
//    ],
//    htmlId: "contact"
//};
//
//const propsDescriptor: ObjectDesc = {
//    type: DataType.OBJECT,
//    displayName: "Footer section",
//    child: {
//        email: {
//            type: DataType.STRING,
//            displayName: "Email",
//            desc: "Email you can be contacted at.",
//            input: InputType.TEXT,
//            default: "mail@example.com",
//        },
//        socialLinks: {
//            type: DataType.ARRAY,
//            displayName: "Links to social platforms.",
//            child: linkDescriptor.propsDescriptor,
//        },
//        imageUrl: {
//            type: DataType.STRING,
//            displayName: "Image Url",
//            desc: "An image to display alongside the text.",
//            input: InputType.URL,
//            default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
//        },
//        htmlId: { ...htmlIdDesc, default: "contact", },
//    }
//}
//
//export const desc: ComponentDescriptor = {
//    id: "id",
//    type: FOOTER_TYPE,
//    name: "Footer",
//    props: defaultProps,
//    propsDescriptor,
//    icon: <Mail className="w-4 h-4" />,
//    acceptsChildren: false,
//    childrenDescriptors: [],
//}
//
//export default {
//    type: FOOTER_TYPE,
//    descriptor: desc,
//    node: Node,
//} as ComponentExport;
