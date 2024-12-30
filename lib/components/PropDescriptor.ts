// ======================================
// Prop descriptor types

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

export type PropsDescriptor = LeafDesc | ArrayDesc | ObjectDesc;

export interface BasePropsDescriptor {
    type: DataType,
    displayName: string;
    desc?: string,
}

export interface LeafDesc extends BasePropsDescriptor {
    input: InputType;
    default: any,
}

export interface ArrayDesc extends BasePropsDescriptor {
    child: PropsDescriptor;
}

export interface ObjectDesc extends BasePropsDescriptor {
    child: {
        [key: string]: PropsDescriptor;
    }
}

// traverses the descriptor and creates an object based on the 'default' values
// of the leaf nodes
export function createDefaultProps(desc: PropsDescriptor): any {
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
