import { ComponentDescriptor } from "./ComponentDescriptor";

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


