import { DataType, InputType, ObjectDesc, PropsDesc } from "../core/props/PropsDescriptor";
import { cn } from "../utils";
import { classNameDesc, alignItemsDesc, justifyContentDesc } from "../core/props/common";
import { FunctionComponent } from "react";
import { IComponent } from "../core/types";
import { createHtmlElementFromReact } from "../core/utils";
import { ComponentPlugin } from "../core/ComponentPluginManager";

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


class Row implements IComponent<RowProps> {

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
        const nodeFromReact = createHtmlElementFromReact(Jsx, props);
        children?.map(c => nodeFromReact.appendChild(c));

        this.htmlElement = nodeFromReact;
        return nodeFromReact;
    }
}


const componentPlugin: ComponentPlugin = {
    type: ROW_TYPE,
    name: "Row",
    description: "Simple row",
    constructorFunc: Row,
};

export default componentPlugin;
