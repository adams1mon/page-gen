import { ReactNode } from "react";
import { PropsDesc } from "./PropsDescriptor";

export interface ComponentDescriptor {
    id: string;
    type: string;
    name: string;
    icon: ReactNode;

    domNode?: HTMLElement;

    // if true, childrenDescriptors is populated,
    // and 'props' will have 'children' populated with the rendered components
    // when the component is rendered to HTML
    acceptsChildren: boolean;
    childrenDescriptors: ComponentDescriptor[];

    parent?: ComponentDescriptor;

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


