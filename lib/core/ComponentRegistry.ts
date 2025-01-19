import { CustomRow } from "../newcomps/CustomRow";
import { HEADING_TYPE, Heading } from "../newcomps/Heading";
import { HERO_TYPE, Hero } from "../newcomps/Hero";
import { ROW_TYPE, Row } from "../newcomps/Row";
import { ComponentWrapper } from "./ComponentWrapper";
import { IComponent } from "./types";

type ICompConstructor = new () => IComponent<any>;

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

        console.log("defined", type, constructorFunc);
    }

    static createInstance(type: string): ComponentWrapper<any> {
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
ComponentRegistry.define(HERO_TYPE, Hero);

