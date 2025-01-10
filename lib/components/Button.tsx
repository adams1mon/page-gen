import { Layout } from "lucide-react";
import { DataType, EMPTY_DESCRIPTOR, EmptyDesc, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { htmlIdDesc } from "./common";
import { createElement, useState } from "react";
import { cn } from "../utils";
import { renderToStaticMarkup, renderToString } from "react-dom/server";

export const BUTTON_TYPE = "Button";

export interface HeroProps {
}

function Node(props: HeroProps) {

    //const [on, setOn] = useState(false);
    const on = false;

    return (
        <>
        <button
            className={cn("p-4 text-white", on ? "bg-blue-500" : "bg-red-500")}
            //onClick={() => setOn(prev => !prev)}
        >
            Some text here
        </button>
        <script> 
            console.log(`sfd`);
        </script>
        </>
    );
}

const defaultProps = {};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Button",
    child: {},
};

const desc: ComponentDescriptor = {
    id: "id",
    type: BUTTON_TYPE,
    name: "Button",
    props: defaultProps,
    propsDescriptor,
    icon: <Layout className="w-4 h-4" />,
    acceptsChildren: false,
    childrenDescriptors: [],
}

export default {
    type: BUTTON_TYPE,
    descriptor: desc,
    node: Node,
} as ComponentExport;

//console.log(renderToStaticMarkup(createElement(Node)));
//console.log(renderToString(createElement(Node)));
