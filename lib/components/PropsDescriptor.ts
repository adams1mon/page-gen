// ======================================
// Prop descriptor types

import { ComponentDescriptor } from "./ComponentContainer";

export enum DataType {
    STRING = "string",
    NUMBER = "number",
    ARRAY = "array",
    OBJECT = "object",

    // a slot to add children components
    COMPONENT_SLOT = "component-slot",

    // empty props, don't render any inputs
    EMPTY = "empty",
}

export enum InputType {
    TEXT,
    TEXTAREA,
    URL,
}

export type PropsDesc = EmptyDesc | LeafDesc | ArrayDesc | ObjectDesc | ComponentSlotDesc;


export interface BaseDesc {
    type: DataType;
    displayName: string;
    desc?: string;
}

// Signals emtpy props, e.g. props: {}
export interface EmptyDesc extends Omit<BaseDesc, "displayName"> {
    type: DataType.EMPTY
}

export interface LeafDesc extends BaseDesc {
    type: DataType.NUMBER | DataType.STRING;
    input: InputType;
    default: any;
}

export interface ArrayDesc extends BaseDesc {
    type: DataType.ARRAY;
    child: PropsDesc;
}

export interface ObjectDesc extends BaseDesc {
    type: DataType.OBJECT;
    child: {
        [key: string]: PropsDesc;
    }
}

export interface ComponentSlotDesc extends BaseDesc {
    type: DataType.COMPONENT_SLOT,
};

// traverses the descriptor and creates an object based on the 'default' values
// of the leaf nodes
export function createDefaultProps(desc: PropsDesc): any {
    switch (desc.type) {
        case DataType.STRING || DataType.NUMBER:
            return (desc as LeafDesc).default;

        case DataType.ARRAY:
            return [createDefaultProps((desc as ArrayDesc).child)]

        case DataType.OBJECT:
            const obj: {[key: string]: any} = {};
            const childDesc = (desc as ObjectDesc).child;
            for (const key in childDesc) {
                obj[key] = createDefaultProps(childDesc[key]);
            }
            return obj;

        case DataType.COMPONENT_SLOT:
            return [];

        default:
            console.log("unknown type: ", desc.type);
            break;
    }
}

export const EMPTY_DESC: EmptyDesc = {
    type: DataType.EMPTY,
};
