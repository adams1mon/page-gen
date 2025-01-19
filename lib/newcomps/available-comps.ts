import { ROW_TYPE, Row } from "./Row";
import { HEADING_TYPE, Heading } from "./Heading";
import { ComponentWrapper, CustomRow, IComponent } from "./types";
import { updateComponentInTree } from "../components-meta/ComponentContainer";

//export const availableComponents: { [key: string]: () => Component } = {
//    [HEADING_TYPE]: () => new Heading(),
//    [ROW_TYPE]: () => new Row(),
//};

type ICompConstructor = new () => IComponent;

export class ComponentRegistry {

    static components: { [key: string]: ICompConstructor } = {};

    static define(type: string, constructorFunc: ICompConstructor) {
        if (typeof type !== "string" || typeof constructorFunc !== "function") {
            throw new Error("'type' must be a string, 'constructorFunc' must be a function");
        }
        if (type in this.components) {
            throw new Error(`${type} component is already defined`);
        }
        this.components[type] = constructorFunc;
        console.log("added", type, constructorFunc);
    }

    static createInstance(type: string): ComponentWrapper {
        if (!(type in ComponentRegistry.components)) {
            throw new Error(`${type} component not found in registry`);
        }
        const comp = new ComponentRegistry.components[type]()
        return new ComponentWrapper(type, comp);
    }
};

ComponentRegistry.define("customRow", CustomRow);
ComponentRegistry.define(ROW_TYPE, Row);
ComponentRegistry.define(HEADING_TYPE, Heading);

