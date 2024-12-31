// ======================================
// Prop descriptor types

import { warn } from "console";

export enum DataType {
    STRING = "string",
    NUMBER = "number",
    ARRAY = "array",
    OBJECT = "object",
}

export enum InputType {
    TEXT,
    TEXTAREA,
    URL,
}

export type PropsDesc = LeafDesc | ArrayDesc | ObjectDesc;

export interface BaseDesc {
    type: DataType;
    displayName: string;
    desc?: string;
}

export interface LeafDesc extends BaseDesc {
    input: InputType;
    default: any;
}

export interface ArrayDesc extends BaseDesc {
    child: PropsDesc;
}

export interface ObjectDesc extends BaseDesc {
    child: {
        [key: string]: PropsDesc;
    }
}

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
        default:
            console.log("unknown type: ", desc.type);
            break;
    }
}
