import { User } from "lucide-react";
import { ComponentContainer, ComponentDescriptor } from "./ComponentContainer";
import { DataType, InputType, ObjectDesc } from "./PropsDescriptor";
import { htmlIdDesc } from "./common";

export const ABOUT_TYPE = "About";

export interface AboutProps {
    title: string;
    description: string[];
    imageUrl: string;
    htmlId: string;
}

function Node(props: AboutProps) {
    return (
        <section id={props.htmlId} className="w-full py-20 bg-background">
            <div className="max-w-5xl mx-auto px-8">
                <h2 className="text-3xl font-bold mb-8">{props.title}</h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div
                        className="aspect-square rounded-lg bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${props.imageUrl}')`
                        }}>
                    </div>
                    <div className="space-y-4">
                        {props.description.map((paragraph, index) =>
                            <p key={index} className="text-lg text-muted-foreground">{paragraph}</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

const defaultProps: AboutProps = {
    title: "About Me",
    description: [
        "I'm a creative professional with a passion for building beautiful and functional digital experiences. With expertise in design and development, I bring ideas to life through clean code and intuitive interfaces.",
        "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the community."
    ],
    imageUrl: "https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?q=80&auto=format&fit=crop",
    htmlId: "about",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "About section",
    child: {
        title: {
            type: DataType.STRING,
            displayName: "Title",
            desc: "Title to display",
            input: InputType.TEXT,
            default: "Title",
        },
        description: {
            type: DataType.ARRAY,
            displayName: "Description",
            child: {
                type: DataType.STRING,
                displayName: "Title",
                desc: "Paragraph to add to the section.",
                input: InputType.TEXTAREA,
                default: "I'm a creative professional with a passion for building beautiful and functional digital experiences. With expertise in design and development, I bring ideas to life through clean code and intuitive interfaces.",
            }
        },
        imageUrl: {
            type: DataType.STRING,
            displayName: "Image Url",
            desc: "An image to display alongside the text.",
            input: InputType.URL,
            default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        },
        htmlId: { ...htmlIdDesc, default: "about", },
    }
};

const desc: ComponentDescriptor = {
        id: "id", // will be overwritten when a new instance is created
        type: ABOUT_TYPE,
        name: "About",
        props: defaultProps,
        propsDescriptor,
        icon: <User className="w-4 h-4" />,
        jsxFunc: Node,
    }

ComponentContainer.save(ABOUT_TYPE, desc);
