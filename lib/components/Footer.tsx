import { Mail } from "lucide-react";
import { ComponentContainer, ComponentDescriptor } from "./ComponentContainer";
import { Link } from "./common";

export const FOOTER_TYPE = "Footer";

export interface FooterProps {
    email: string;
    socialLinks: Link[];
}

function Node(props: FooterProps) {
    return (
        <footer className="w-full py-12 bg-background border-t">
            <div className="max-w-5xl mx-auto px-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <p className="text-muted-foreground">{props.email}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Social</h3>
                        <div className="space-y-2">
                            {props.socialLinks.map(link => (
                                <a
                                    href={link.url}
                                    className="block text-muted-foreground hover:text-foreground">
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const defaultProps: FooterProps = {
    email: "email@example.com",
    socialLinks: [
        { text: "GitHub", url: "https://github.com" },
        { text: "LinkedIn", url: "https://linkedin.com" },
        { text: "Twitter", url: "https://twitter.com" }
    ]
};

export const urlPropDescription = {
    text: {
        type: "string",
        label: "Text",
    },
    url: {
        type: "string",
        label: "Url",
    },
}

const desc: ComponentDescriptor = {
    type: FOOTER_TYPE,
    name: "Footer",
    defaultProps,
    icon: <Mail className="w-4 h-4" />,
    jsxFunc: Node,
}

ComponentContainer.register(FOOTER_TYPE, desc);
