import { DataType, InputType, ObjectDesc, PropsDesc } from "../core/props/PropsDescriptor";
import { cn } from "../utils";
import { classNameDesc, alignItemsDesc, justifyContentDesc } from "../core/props/common";
import { FunctionComponent } from "react";
import { IComponent } from "../core/types";
import { createHtmlElementFromReact } from "../core/utils";

export const ROW_TYPE = "Row";

export interface RowProps {
    gap: string;
    alignItems: string;
    justifyContent: string;
    className?: string;
}

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


export class Row implements IComponent<RowProps> {

    componentName: string = "Row";
    propsDescriptor: PropsDesc = propsDescriptor;
    acceptsChildren: boolean = true;
    initialProps?: RowProps = defaultProps;

    htmlElement?: HTMLElement;

    createHtmlElement(props: RowProps, children?: HTMLElement[]): HTMLElement {
        console.log("create Row html");

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

        const Jsx: FunctionComponent<RowProps> = (props) => {
            return (
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
            )
        };

        // option 1: create DOM node from react element and add children dom nodes to it
        // option 2: create react nodes from the children (requires writing a converter) and 
        // add them to the props.children of the react node

        // go with option 1 for now.

        // add the children
        console.log("row props in create html", props);

        const nodeFromReact = createHtmlElementFromReact(Jsx, props);
        console.log("from react", nodeFromReact);

        children?.map(c => nodeFromReact.appendChild(c));

        this.htmlElement = nodeFromReact;
        return nodeFromReact;
    }
}

