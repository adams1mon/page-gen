import { Layout } from "lucide-react";
import { ComponentContainer, ComponentDescriptor } from "./ComponentContainer";
import { DataType, InputType, ObjectDesc } from "./PropDescriptor";
import { Link, httpLinkDesc } from "./Link";
import { htmlIdDesc } from "./common";

export const HEADER_TYPE = "Header";

export interface HeaderProps {
    title: string;
    links: Link[];
    htmlId: string;
}

function Node(props: HeaderProps) {
    return (
        <header id={props.htmlId} className="w-full py-6 px-8 bg-background border-t">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{props.title}</h1>
                    <nav className="space-x-6">
                        {props.links.map((link, index) => (
                            <a key={index} href={link.url} className="text-muted-foreground hover:text-foreground">
                                {link.text}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}

const defaultProps: HeaderProps = {
    title: "Your Name",
    links: [
        { text: "About", url: "#about" },
        { text: "Projects", url: "#projects" },
        { text: "Contact", url: "#contact" }
    ],
    htmlId: "header"
};


const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Header section",
    child: {
        title: {
            type: DataType.STRING,
            displayName: "Title",
            desc: "Title to display in the header",
            input: InputType.TEXT,
            default: "Title",
        },
        links: {
            type: DataType.ARRAY,
            displayName: "Links",
            desc: "Links to display in the header",
            child: { 
                ...httpLinkDesc,
            },
        },
        htmlId: { ...htmlIdDesc, default: "header", },
    }
}

const desc: ComponentDescriptor = {
    id: "id",
    type: HEADER_TYPE,
    name: "Header",
    props: defaultProps,
    propsDescriptor,
    icon: <Layout className="w-4 h-4" />,
    jsxFunc: Node,
}

ComponentContainer.register(HEADER_TYPE, desc);
