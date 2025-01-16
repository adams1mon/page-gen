import { ComponentExport, createHtmlNodeFromReact } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc, PropsDesc } from "../components-meta/PropsDescriptor";
import { cn } from "../utils";
import { Component } from "./Heading";
import { ChildrenContainer, createId } from "./Page";
import { classNameDesc, alignItemsDesc, justifyContentDesc } from "../components/common";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { FunctionComponent } from "react";

export const ROW_TYPE = "Row";

export interface RowProps {
    gap: string;
    alignItems: string;
    justifyContent: string;
    className?: string;
}

function Node(props: RowProps) {
    const baseClasses = "flex w-full";
    const gapClasses = {
        '1rem': 'gap-4',
        '0.5rem': 'gap-2',
        '2rem': 'gap-8',
    };
    const alignmentClasses = {
        'stretch': 'items-stretch',
        'center': 'items-center',
        'flex-start': 'items-start',
        'flex-end': 'items-end',
    };
    const justifyClasses = {
        'flex-start': 'justify-start',
        'center': 'justify-center',
        'flex-end': 'justify-end',
        'space-between': 'justify-between',
        'space-around': 'justify-around',
    };

    return (
        <div
            className={
                cn(
                    baseClasses,
                    gapClasses[props.gap as keyof typeof gapClasses] || 'gap-4',
                    alignmentClasses[props.alignItems as keyof typeof alignmentClasses] || 'items-center',
                    justifyClasses[props.justifyContent as keyof typeof justifyClasses] || 'justify-start',
                    props.className
                )
            }
        >
            {props.children}
        </div>
    );
};

const defaultProps: RowProps = {
    gap: "1rem",
    alignItems: "center",
    justifyContent: "flex-start",
    className: "",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Row",
    child: {
        gap: {
            type: DataType.STRING,
            displayName: "Gap",
            desc: "Space between child elements",
            input: InputType.TEXT,
            default: "1rem",
        },
        alignItems: alignItemsDesc,
        justifyContent: justifyContentDesc,
        className: classNameDesc,
    }
};

export class Row implements Component, ChildrenContainer {

    type: string = ROW_TYPE;
    propsDescriptor: PropsDesc = propsDescriptor;

    id: string;
    props: RowProps;
    domNode: HTMLElement;
    parent?: ChildrenContainer;
    children: Component[] = [];

    constructor(props: RowProps = defaultProps) {
        this.id = createId(this.type);
        this.props = props;
        this.domNode = this.createHtml();
    }

    clone(): Component { 
        const row = new Row(this.props);
        row.children = this.children.map(c => c.clone());
        return row;
    }

    createHtml(): HTMLElement {
        const baseClasses = "flex w-full";
        const gapClasses = {
            '1rem': 'gap-4',
            '0.5rem': 'gap-2',
            '2rem': 'gap-8',
        };
        const alignmentClasses = {
            'stretch': 'items-stretch',
            'center': 'items-center',
            'flex-start': 'items-start',
            'flex-end': 'items-end',
        };
        const justifyClasses = {
            'flex-start': 'justify-start',
            'center': 'justify-center',
            'flex-end': 'justify-end',
            'space-between': 'justify-between',
            'space-around': 'justify-around',
        };

        const Jsx: FunctionComponent<RowProps>  = (props) => (
            <div
                data-r-id="row"
                className={
                    cn(
                        baseClasses,
                        gapClasses[props.gap as keyof typeof gapClasses] || 'gap-4',
                        alignmentClasses[props.alignItems as keyof typeof alignmentClasses] || 'items-center',
                        justifyClasses[props.justifyContent as keyof typeof justifyClasses] || 'justify-start',
                        props.className
                    )
                }
            > 
            </div>
        );

        // option 1: create DOM node from react element and add children dom nodes to it
        // option 2: create react nodes from the children (requires writing a converter) and 
        // add them to the props.children of the react node

        // go with option 1 for now.
        
        // add the children
        const nodeFromReact = createHtmlNodeFromReact(Jsx, this.props);
        console.log("from react", nodeFromReact);
        
        for (const c of this.children) {
            nodeFromReact.appendChild(c.createHtml());
        }

        return nodeFromReact;
    }

    addChild(child: Component) { 
        this.children.push(child);
        child.parent = this;
        this.domNode = this.createHtml();
    }

    removeChild(child: Component) {
        this.children.filter(c => c.id !== child.id);
        this.createHtml();
    }

    // TODO:
    addSibling(reference: Component, child: Component, position: 'before' | 'after') {
        let index = this.children.findIndex(c => c.id == reference.id);
        //
        //if (position == 'before') {
        //    reference.domNode.insertAdjacentElement('beforebegin', child.domNode);
        //} else if (position == 'after') {
        //    reference.domNode.insertAdjacentElement('afterend', child.domNode);
        //
        //    if (index && index > -1) {
        //        index++;
        //    }
        //}
        //
        //// update descriptors
        //if (index !== undefined && index !== -1) {
        //    parent!.childrenDescriptors.splice(index, 0, child);
        //}
        //
        //// update parent
        //child.parent = reference.parent;
        //
        //console.log("DOM: added sibling", child, " to reference", reference);
    }

    isEmpty() {
        return this.children.length === 0;
    }


    update(props: RowProps): HTMLElement {
        this.props = props;
        this.domNode = this.createHtml();
        return this.domNode;
    }
}

//const desc: ComponentDescriptor = {
//    id: "id",
//    type: ROW_TYPE,
//    name: "Row",
//    icon: <LayoutGrid className="w-4 h-4" />,
//    props: defaultProps,
//    propsDescriptor,
//    acceptsChildren: true,
//    childrenDescriptors: [],
//};
//
//export default {
//    type: ROW_TYPE,
//    descriptor: desc,
//    createHtmlNode: (props) => createHtmlNodeFromReact(Node, props)
//} as ComponentExport;
//
