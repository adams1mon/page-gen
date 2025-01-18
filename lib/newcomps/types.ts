import { PropsDesc } from "../components-meta/PropsDescriptor";

// NOT FOR SAVING!
export interface ComponentDesc {
    type: string;
    propsDescriptor: PropsDesc;
    defaultProps: any;
    createHtmlElement: (props: any, children?: Component[]) => HTMLElement;
};

export interface Component extends ComponentDesc {
    id: string;
    htmlElement: HTMLElement;

    // should be set when this element is added to one with children
    parent?: ComponentWithChildren;
}

export interface ComponentWithChildren extends Component {
    children: Component[];
    isEmpty: () => boolean;
    addChild: (child: Component, index?: number) => void;
    removeChild: (child: Component) => void;
    findChildById: (id: string) => Component | null;
};
