import { ComponentWrapper } from "./ComponentWrapper";
import { PropsDesc } from "./props/PropsDescriptor";

export interface ChildrenContainer {
    children?: ComponentWrapper<any>[];
    addChild: (child: ComponentWrapper<any>, index?: number) => void;
    removeChild: (child: ComponentWrapper<any>) => void;
    findChildById: (id: string) => ComponentWrapper<any> | null;
};

export interface IComponent<T> {
    componentName: string;
    propsDescriptor: PropsDesc;
    initialProps?: T;
    acceptsChildren: boolean;
    createHtmlElement: (props: T, children?: HTMLElement[]) => HTMLElement;
    update?: (props: T, children?: HTMLElement[]) => HTMLElement;
}

