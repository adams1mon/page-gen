import { ComponentNode } from "./ComponentWrapper";
import { PropsDescriptor } from "./props/PropsDescriptor";

export interface ChildrenContainer {
    children?: ComponentNode<any>[];
    addChild: (child: ComponentNode<any>, index?: number) => void;
    removeChild: (child: ComponentNode<any>) => void;
    findChildById: (id: string) => ComponentNode<any> | null;
};


// NOTE: The component MUST NOT make any assumptions about the children HTML
// it gets passed in. It shouldn't really modify them, that will likely break
// the editor because the editor adds wrapper div elements around the 
// HTMLs of the components to provide additional editor functionalities.
export interface IComponent<T> {
    propsDescriptor: PropsDescriptor;
    initialProps?: T;
    acceptsChildren: boolean;
    createHtmlElement: (props: T, children?: HTMLElement[]) => HTMLElement;
    update?: (props: T, children?: HTMLElement[]) => HTMLElement;
}

