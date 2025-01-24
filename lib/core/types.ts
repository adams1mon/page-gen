import { ComponentNode } from "./ComponentWrapper";
import { PropsDesc } from "./props/PropsDescriptor";

export interface ChildrenContainer {
    children?: ComponentNode<any>[];
    addChild: (child: ComponentNode<any>, index?: number) => void;
    removeChild: (child: ComponentNode<any>) => void;
    findChildById: (id: string) => ComponentNode<any> | null;
};

export interface IComponent<T> {
    propsDescriptor: PropsDesc;
    initialProps?: T;
    acceptsChildren: boolean;
    createHtmlElement: (props: T, children?: HTMLElement[]) => HTMLElement;
    update?: (props: T, children?: HTMLElement[]) => HTMLElement;
}

