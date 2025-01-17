import { DataType, InputType, ObjectDesc, PropsDesc } from "../components-meta/PropsDescriptor";
import { classNameDesc } from "../components/common";
import { tag } from "../site-generator/generate-html";
import { ChildrenContainer, createId } from "./Page";
import { addSibling, updateComp } from "./utils";

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

export interface Component {

    // static 
    type: string;
    propsDescriptor: PropsDesc;

    // dynamic, existing once created
    id: string;
    props: any;
    domNode: HTMLElement;

    // set by a ChildrenContainer when this element is added
    parent?: ChildrenContainer;

    update: (props: any) => void;
    createHtml: () => HTMLElement;
    clone: () => any;
    addSibling: (child: Component, position: 'before' | 'after') => void;
};

export class Heading implements Component {

    type: string = HEADING_TYPE;
    propsDescriptor: PropsDesc = propsDescriptor;

    id: string;
    props: HeadingProps;
    domNode: HTMLElement;
    parent?: ChildrenContainer;

    constructor(props: HeadingProps = defaultProps) {
        this.id = createId(this.type);
        this.props = props;
        this.domNode = this.createHtml();
    }

    clone(): Heading { 
        return new Heading(this.props);
    }

    createHtml(): HTMLElement {
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

        const hTag = `h${this.props.level || 1}` as keyof JSX.IntrinsicElements;
        const h = tag(hTag, {"data-id": this.id});

        h.classList.add(
            ...baseClasses,
            ...levelClasses[this.props.level as keyof typeof levelClasses || '1'],
            alignmentClasses[this.props.textAlign as keyof typeof alignmentClasses || 'left'],
        );

        if (this.props.className) {
            const classes = this.props.className.split(" ").filter(s => s.trim() !== "")
            h.classList.add(...classes);
        }

        h.innerText = this.props.content;

        return h;
    }

    update(props: HeadingProps) { 
        updateComp(this, props);
    }

    addSibling(child: Component, position: "before" | "after") {
        addSibling(this, child, position);
    }
}


//const desc: ComponentDescriptor = {
//    id: "id",
//    type: HEADING_TYPE,
//    name: "Heading",
//    icon: <Heading1 className="w-4 h-4" />,
//    props: defaultProps,
//    propsDescriptor,
//    acceptsChildren: false,
//    childrenDescriptors: [],
//};

//export default {
//    type: HEADING_TYPE,
//    descriptor: desc,
//    //node: Node,
//    createHtmlNode,
//} as ComponentExport;
