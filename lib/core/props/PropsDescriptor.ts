// ======================================
// Prop descriptor types

export enum DataType {
    STRING = "string",
    NUMBER = "number",
    ARRAY = "array",
    OBJECT = "object",

    // empty props, don't render any inputs
    EMPTY = "empty",
}

export enum InputType {
    TEXT,
    TEXTAREA,
    URL,
}

export type PropsDesc = EmptyDesc | LeafDesc | ArrayDesc | ObjectDesc;

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

// traverses the descriptor and creates an object based on the 'default' values
// of the leaf nodes
export function createDefaultProps(desc: PropsDesc): any {
    switch (desc.type) {
        case DataType.STRING || DataType.NUMBER:
            return (desc as LeafDesc).default;

        case DataType.ARRAY:
            return [createDefaultProps((desc as ArrayDesc).child)]

        case DataType.OBJECT:
            const obj: { [key: string]: any } = {};
            const childDesc = (desc as ObjectDesc).child;
            for (const key in childDesc) {
                obj[key] = createDefaultProps(childDesc[key]);
            }
            return obj;
        case DataType.EMPTY:
            return {};
        default:
            console.log("unknown type: ", desc.type);
            break;
    }
}

export const EMPTY_DESCRIPTOR: EmptyDesc = {
    type: DataType.EMPTY,
};
