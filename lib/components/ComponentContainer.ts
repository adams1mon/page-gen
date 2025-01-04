import { ReactNode } from "react";
import { PropsDesc } from "./PropsDescriptor";


export interface ComponentDescriptor {
    id: string;
    type: string;
    name: string;
    icon: ReactNode;

    // if true, childrenDescriptors is populated,
    // and 'props' will have 'children' populated with the rendered components
    // when the component is rendered to HTML
    acceptsChildren: boolean;
    childrenDescriptors: ComponentDescriptor[];

    // Props that will be passed in to the React node once created.
    //
    // Contains user-defined props as well as some reserved attributes,
    // which are added when generating the React nodes to get the markup.
    //
    // Reserved attributes:
    //
    // "children": 
    // Added if the component enables the nesting of other components.
    // The attribute is added if the "propsDescriptor" tree contains
    // a "childrenDesc" attribute, which will be populated with descriptors 
    //
    // "key" 
    // Added for every component, set to the "id". 
    props: any;

    // Descriptors of the props to generate inputs for them, 
    // a recursive tree.
    propsDescriptor: PropsDesc;
}

// enables the nesting of components, used in the 'props' of a ComponentDescriptor
export interface ComponentPropsWithChildren {
    
    // NOTE: React nodes will be rendered here
    children: ReactNode[];
};


export function updateProps(comp: ComponentDescriptor, props: any): ComponentDescriptor {
    return {
        ...comp,
        props,
    }
}

// holds component descriptors and creates new component descriptors based on the templates
export class ComponentContainer {
    static components: { [type: string]: ComponentDescriptor } = {};
    static jsxFuncs: { [type: string]: React.FunctionComponent<any>} = {};

    static save(
        type: string,
        descriptorTemplate: ComponentDescriptor,
        jsxFunc: React.FunctionComponent<any>,
    ) {
        this.components[type] = descriptorTemplate;
        this.jsxFuncs[type] = jsxFunc;
    }

    static getReactElement(type: string): React.FunctionComponent<any> {
        return this.jsxFuncs[type];
    }

    static createInstance(type: string): ComponentDescriptor {
        const desc = this.getDescriptor(type);

        if (!desc) {
            throw new Error(`Component of type ${type} does not exist`);
        }

        return {
            ...desc,
            id: `${type}-${Date.now()}`,
        }
    }

    static getDescriptor(type: string): ComponentDescriptor | undefined {
        return this.components[type];
    }
}


