import { ReactNode } from "react";

export interface ComponentDescriptor {
    id: string,
    type: string,
    name: string,
    icon: ReactNode,
    props: any,
    jsxFunc: React.FunctionComponent<any>,
}

export function updateProps(comp: ComponentDescriptor, props: any): ComponentDescriptor {
    return {
        ...comp,
        props,
    }
}


// holds component descriptors and creates new component descriptors based on the templates

export class ComponentContainer {
    static components: { [type: string]: ComponentDescriptor } = {};

    static register(
        type: string,
        descriptorTemplate: ComponentDescriptor,
    ) {
        ComponentContainer.components[type] = descriptorTemplate;
    }

    static createInstance(type: string): ComponentDescriptor {
        const desc = ComponentContainer.getDescriptor(type);
        return {
            ...desc,
            id: `${type}-${Date.now()}`,
        }
    }

    static getDescriptor(type: string): ComponentDescriptor {
        const desc = ComponentContainer.components[type];
        if (!desc) throw new Error(`component ${type} is not registered`);
        return desc;
    }
}

