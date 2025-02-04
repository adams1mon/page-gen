import { PropContentType, PropType, PropsDescriptorRoot } from "../core/props/PropsDescriptor";
import { classNameDesc } from "../core/props/common";
import { tag } from "../core/utils";
import { IComponent } from "../core/types";
import { ComponentPlugin } from "../core/ComponentPluginManager";

export const HEADING_TYPE = "Heading";

export interface HeadingProps {
    content: string;
    level: string;
    textAlign: string;
    className?: string;
}

const defaultProps: HeadingProps = {
    content: "Heading",
    level: "1",
    textAlign: "left",
    className: "",
};

const propsDescriptor: PropsDescriptorRoot = {
    descriptors: {
        content: {
            propType: PropType.LEAF,
            displayName: "Content",
            desc: "Heading text",
            contentType: PropContentType.TEXT,
            default: "Heading",
        },
        level: {
            propType: PropType.LEAF,
            displayName: "Level",
            desc: "Heading level (1-6)",
            contentType: PropContentType.TEXT,
            default: "1",
        },
        textAlign: {
            propType: PropType.LEAF,
            displayName: "Text Align",
            desc: "Text alignment (left, center, right)",
            contentType: PropContentType.TEXT,
            default: "left",
        },
        className: classNameDesc,
    },
};

class Heading implements IComponent<HeadingProps> {

    propsDescriptor: PropsDescriptorRoot = propsDescriptor;
    acceptsChildren: boolean = false;
    initialProps?: HeadingProps = defaultProps;

    createHtmlElement(props: HeadingProps): HTMLElement {
        const baseClasses = ["font-bold", "text-foreground"];
        const alignmentClasses = {
            'left': 'text-left',
            'center': 'text-center',
            'right': 'text-right'
        };
        const levelClasses = {
            '1': ['text-4xl', 'mb-6'],
            '2': ['text-3xl', 'mb-5'],
            '3': ['text-2xl', 'mb-4'],
            '4': ['text-xl', 'mb-3'],
            '5': ['text-lg', 'mb-2'],
            '6': ['text-base', 'mb-2']
        };

        const hTag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;
        const h = tag(hTag);

        h.classList.add(
            ...baseClasses,
            ...levelClasses[props.level as keyof typeof levelClasses || '1'],
            alignmentClasses[props.textAlign as keyof typeof alignmentClasses || 'left'],
        );

        if (props.className) {
            const classes = props.className.split(" ").filter(s => s.trim() !== "")
            h.classList.add(...classes);
        }

        h.innerText = props.content;

        return h;
    }
}

const componentPlugin: ComponentPlugin = {
    type: HEADING_TYPE,
    name: "Heading",
    constructorFunc: Heading,
};

export default componentPlugin;

