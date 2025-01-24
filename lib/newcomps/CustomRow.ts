import { EMPTY_DESCRIPTOR, PropsDesc } from "../core/props/PropsDescriptor";
import { IComponent } from "../core/types";
import { tag } from "../core/utils";
import { ComponentPlugin } from "../core/ComponentPluginManager";


class CustomRow implements IComponent<any> {

    componentName: string = "customrow";
    propsDescriptor: PropsDesc = EMPTY_DESCRIPTOR;
    acceptsChildren: boolean = true;

    createHtmlElement(props: any, children?: HTMLElement[]): HTMLElement {
        console.log("create custom row, props:", props);
        console.log("custom row got children", children);

        const d = tag("div", { "data-custom": "row" });
        d.style.outline = "2px solid yellow";
        d.innerText = "AAAAAH CUstom ROWW";
        return d;
    }
}


const componentPlugin: ComponentPlugin = {
    type: "customrow",
    name: "Custom Row",
    description: "not even a row",
    constructorFunc: CustomRow,
};

export default componentPlugin;

