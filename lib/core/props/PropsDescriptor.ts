// ======================================
// Prop descriptor types

// Categories for organizing props in the editor UI
export enum PropCategory {
    GENERAL = "general",      // Unspecified settings go here
    CONTENT = "content",      // Text, images, etc
    LAYOUT = "layout",        // Spacing, alignment, etc
    STYLE = "style",         // Visual styling
    BEHAVIOR = "behavior",    // Interactions, animations
    ADVANCED = "advanced",    // Technical/developer settings
    METADATA = "metadata",    // SEO, ids, etc
}

export interface PropsDescriptorWrapper {
    descriptor: PropsDescriptor;
}

export interface PropsDescriptorMeta {
    // If the category is included in descriptor of type OBJECT,
    // all the nested categories should be ignored when generating the UI.
    category?: PropCategory;
    desc?: string;
    displayName: string;

    propType: PropType;
}

// the below 3 interfaces are exclusive, hence the "never" declarations
export interface PropsDescriptorObject extends PropsDescriptorMeta {
    // override
    propType: PropType.OBJECT;

    // object attributes
    child: { [propName: string]: PropsDescriptor };
}

export interface PropsDescriptorArray extends PropsDescriptorMeta {
    // override
    propType: PropType.ARRAY;

    // array attributes
    // homogenous array type
    // NOTE: only the first key-value pair will be taken into consideration
    //child: { [propName: string]: PropsDescriptor };
    child: PropsDescriptor;
}

export interface PropsDescriptorLeaf extends PropsDescriptorMeta {
    // override
    propType: PropType.LEAF;

    // leaf attributes
    contentType: PropContentType;
    default: any;
}

export enum PropType {
    ARRAY,
    OBJECT,
    LEAF,
}

export enum PropContentType {
    TEXT,
    TEXTAREA,
    URL,
    NUMBER,
}


export type PropsDescriptor = PropsDescriptorObject | PropsDescriptorArray | PropsDescriptorLeaf;


// traverses the descriptor and creates an object based on the 'default' values
// of the leaf nodes
export function createDefaultProps(desc: PropsDescriptor): any {
    switch (desc.propType) {
        case PropType.LEAF:
            return desc.default;

        case PropType.ARRAY:
            return [createDefaultProps(desc.child)]

        case PropType.OBJECT:
            const obj: { [key: string]: any } = {};
            const childDesc = desc.child;

            for (const key in childDesc) {
                obj[key] = createDefaultProps(childDesc[key]);
            }
            return obj;

        default:
            console.log("unknown prop descriptor", desc.propType);
            break;
    }
};

