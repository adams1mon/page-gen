// ======================================
// Prop descriptor types

// Categories for organizing props in the editor UI
export enum PropCategory {
    GENERAL = "general",      // Unspecified settings go here
    CONTENT = "content",      // Text, images, etc
    LAYOUT = "layout",        // Spacing, alignment, etc
    STYLE = "style",          // Visual styling
    BEHAVIOR = "behavior",    // Interactions, animations
    ADVANCED = "advanced",    // Technical/developer settings
    METADATA = "metadata",    // SEO, ids, etc
}

export interface PropsDescriptorMeta {
    // TODO: think of a better way
    // If the category is included in descriptor of type OBJECT,
    // all the nested categories should be ignored when generating the UI.
    category?: PropCategory;
    desc?: string;
    displayName: string;
    propType: PropType;
};

export interface PropsDescriptorRoot {
    descriptors: { [key: string]: PropsDescriptor };
};

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

export type PropsDescriptor = PropsDescriptorObject
    | PropsDescriptorArray
    | PropsDescriptorLeaf;


// traverses the descriptor and creates an object based on the 'default' values
// of the leaf nodes
export function createDefaultProps(root: PropsDescriptorRoot): any {

    const obj: { [key: string]: any } = {};
    for (const key in root.descriptors) {
        const desc = root.descriptors[key];
        obj[key] = createDefaultPropsForDescriptor(desc);
    }

    return obj;
}

export function createDefaultPropsForDescriptor(desc: PropsDescriptor): any {
    switch (desc.propType) {
        case PropType.LEAF:
            return desc.default;

        case PropType.ARRAY:
            return [createDefaultPropsForDescriptor(desc.child)]

        case PropType.OBJECT:
            const obj: { [key: string]: any } = {};
            const childDesc = desc.child;

            for (const key in childDesc) {
                obj[key] = createDefaultPropsForDescriptor(childDesc[key]);
            }
            return obj;

        default:
            console.log("unknown prop descriptor", desc.propType);
            break;
    }
};

