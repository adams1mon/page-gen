import { ReactNode } from "react";


// holds the static state of a component
export interface ComponentDescriptor {
    type: string,
    name: string,
    icon: ReactNode,
    defaultProps: any,
    jsxFunc: React.FunctionComponent<any>,
}

// holds the mutable state of a newly created component
export interface ComponentInstance {
    id: string,
    type: string,
    props: any,
}

// hands out component factory functions to any React node that wants
// to create a particular component

export class ComponentContainer {
    static components: { [type: string]: ComponentDescriptor } = {};

    static register(
        type: string,
        descriptor: ComponentDescriptor,
    ) {
        ComponentContainer.components[type] = descriptor;
    }

    static createInstance(type: string): ComponentInstance {
        const desc = ComponentContainer.getDescriptor(type);
        return {
            id: `${type}-${Date.now()}`,
            type,
            props: desc.defaultProps,
        }
    }

    static getDescriptor(type: string): ComponentDescriptor {
        const desc = ComponentContainer.components[type];
        if (!desc) throw new Error(`component ${type} is not registered`);
        return desc;
    }
}

