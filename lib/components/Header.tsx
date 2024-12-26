import { Layout } from "lucide-react";
import { Link } from "./common";
import { ComponentContainer, ComponentDescriptor } from "./ComponentContainer";

export const HEADER_TYPE = "Header";

export interface HeaderProps {
    title: string;
    links: Link[];
}

const defaultProps = {
    title: "Your Name",
    links: [
        { text: "About", url: "#about" },
        { text: "Projects", url: "#projects" },
        { text: "Contact", url: "#contact" }
    ]
};

function Node(props: HeaderProps) {
    return (
        <header className="w-full py-6 px-8 bg-background border-t" >
            <div className="max-w-5xl mx-auto" >
                <div className="flex justify-between items-center" >
                    <h1 className="text-2xl font-bold" > {props.title}</h1 >
                    <nav className="space-x-6" >
                        {props.links.map((link, index) => (
                            <a key={index} href={link.url} className="text-muted-foreground hover:text-foreground" >
                                {link.text}
                            </a>
                        ))}
                    </nav >
                </div >
            </div >
        </header >
    );
}

const desc: ComponentDescriptor = {
    type: HEADER_TYPE,
    name: "Header",
    defaultProps,
    icon: <Layout className="w-4 h-4" />,
    jsxFunc: Node,
}

ComponentContainer.register(HEADER_TYPE, desc);

