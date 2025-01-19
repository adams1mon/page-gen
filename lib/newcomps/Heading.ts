import { DataType, InputType, ObjectDesc, PropsDesc } from "../components-meta/PropsDescriptor";
import { classNameDesc } from "../components/common";
import { tag } from "../site-generator/generate-html";
import { IComponent } from "./types";

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

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Heading",
    child: {
        content: {
            type: DataType.STRING,
            displayName: "Content",
            desc: "Heading text",
            input: InputType.TEXT,
            default: "Heading",
        },
        level: {
            type: DataType.STRING,
            displayName: "Level",
            desc: "Heading level (1-6)",
            input: InputType.TEXT,
            default: "1",
        },
        textAlign: {
            type: DataType.STRING,
            displayName: "Text Align",
            desc: "Text alignment (left, center, right)",
            input: InputType.TEXT,
            default: "left",
        },
        className: classNameDesc,
    }
};

//export class Heading extends Component {
//
//    constructor(props: HeadingProps = defaultProps) {
//        super(HEADING_TYPE, props, propsDescriptor);
//    }
//
//    clone(): Heading { 
//        return new Heading(this.props);
//    }
//
//    createHtmlElement(): HTMLElement {
//        const baseClasses = ["font-bold", "text-foreground"];
//        const alignmentClasses = {
//            'left': 'text-left',
//            'center': 'text-center',
//            'right': 'text-right'
//        };
//        const levelClasses = {
//            '1': ['text-4xl', 'mb-6'],
//            '2': ['text-3xl', 'mb-5'],
//            '3': ['text-2xl', 'mb-4'],
//            '4': ['text-xl', 'mb-3'],
//            '5': ['text-lg', 'mb-2'],
//            '6': ['text-base', 'mb-2']
//        };
//
//        const hTag = `h${this.props.level || 1}` as keyof JSX.IntrinsicElements;
//        const h = tag(hTag, {"data-id": this.id});
//
//        h.classList.add(
//            ...baseClasses,
//            ...levelClasses[this.props.level as keyof typeof levelClasses || '1'],
//            alignmentClasses[this.props.textAlign as keyof typeof alignmentClasses || 'left'],
//        );
//
//        if (this.props.className) {
//            const classes = this.props.className.split(" ").filter(s => s.trim() !== "")
//            h.classList.add(...classes);
//        }
//
//        h.innerText = this.props.content;
//
//        return h;
//    }
//}

export class Heading implements IComponent {

    componentName: string = "Heading";
    propsDescriptor: PropsDesc = propsDescriptor;
    acceptsChildren: boolean = false;

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

