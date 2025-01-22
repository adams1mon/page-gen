import { DataType, InputType, ObjectDesc, PropsDesc } from "../core/props/PropsDescriptor";
import { createHtmlElementFromReact } from "../core/utils";
import { htmlIdDesc } from "../core/props/common";
import { IComponent } from "../core/types";

export const HERO_TYPE = "Hero";

export interface HeroProps {
    title: string;
    subtitle: string;
    backgroundType: string;
    backgroundUrl: string;
    htmlId: string;
}

function Node(props: HeroProps) {
    return (
        <section id={props.htmlId} className="w-full min-h-[500px] relative flex items-center">
            {props.backgroundType === 'video'
                ? <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
                    <source src={props.backgroundUrl} type="video/mp4" />
                </video>
                :
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${props.backgroundUrl}')`
                    }}></div>
            }
            <div className="relative z-10 max-w-5xl mx-auto px-8 py-20">
                <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg">
                    <h1 className="text-5xl font-bold mb-6">{props.title}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">{props.subtitle}</p>
                </div>
            </div>
        </section>
    );
}

const defaultProps: HeroProps = {
    title: "Welcome to My Portfolio",
    subtitle: "I'm a passionate creator building amazing digital experiences. Explore my work and let's create something amazing together.",
    backgroundType: "image",
    backgroundUrl: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80",
    htmlId: "hero"
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Hero section",
    child: {
        title: {
            type: DataType.STRING,
            displayName: "Title",
            desc: "Title to display in the middle of the Hero section.",
            input: InputType.TEXT,
            default: "Welcome to My Portfolio",
        },
        subtitle: {
            type: DataType.STRING,
            displayName: "Subtitle",
            desc: "Subtitle to display in the Hero section.",
            input: InputType.TEXTAREA,
            default: "I'm a passionate creator building amazing digital experiences. Explore my work and let's create something amazing together.",
        },
        backgroundType: {
            type: DataType.STRING,
            displayName: "Background type (image or video)",
            desc: "Background behind the text.",
            input: InputType.URL,
            default: "image",
        },
        backgroundUrl: {
            type: DataType.STRING,
            displayName: "Image or Video URL",
            desc: "An image or video to display behind the text.",
            input: InputType.URL,
            default: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80",
        },
        htmlId: { ...htmlIdDesc, default: "hero" },
    }
};

export class Hero implements IComponent<HeroProps> {

    componentName: string = "Hero";
    propsDescriptor: PropsDesc = propsDescriptor;
    acceptsChildren: boolean = false;
    initialProps?= defaultProps;

    createHtmlElement(props: HeroProps): HTMLElement {

        const jsx = (props: HeroProps) => (
            <section id={props.htmlId} className="w-full min-h-[500px] relative flex items-center">
                {props.backgroundType === 'video'
                    ? <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
                        <source src={props.backgroundUrl} type="video/mp4" />
                    </video>
                    :
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${props.backgroundUrl}')`
                        }}></div>
                }
                <div className="relative z-10 max-w-5xl mx-auto px-8 py-20">
                    <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg">
                        <h1 className="text-5xl font-bold mb-6">{props.title}</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">{props.subtitle}</p>
                    </div>
                </div>
            </section>
        );

        return createHtmlElementFromReact(jsx, props);
    }
}
