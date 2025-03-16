import { ComponentNode } from "./ComponentWrapper";
import { PropsDescriptorRoot } from "./props/PropsDescriptor";

export interface ChildrenContainer {
    children?: ComponentNode[];
    addChild: (child: ComponentNode, index?: number) => void;
    removeChild: (child: ComponentNode) => void;
    findChildById: (id: string) => ComponentNode | null;
};


// NOTE: The component MUST NOT make any assumptions about the children HTML
// it gets passed in. It shouldn't really modify them, that will likely break
// the editor because the editor adds wrapper div elements around the 
// HTMLs of the components to provide additional editor functionalities.
export interface IComponent {
    propsDescriptor: PropsDescriptorRoot;
    initialProps?: any;
    acceptsChildren: boolean;
    createHtmlElement: (props: any, children?: HTMLElement[]) => HTMLElement;
    update?: (props: any, children?: HTMLElement[]) => HTMLElement;
}

