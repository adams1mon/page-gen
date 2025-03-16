import CustomRow from "../newcomps/CustomRow";
import Heading from "../newcomps/Heading";
import Hero from "../newcomps/Hero";
import Row from "../newcomps/Row";
import { IComponent } from "./types";

type ICompConstructor = new () => IComponent;

export interface ComponentPlugin {
    type: string,
    name: string,
    description?: string,
    constructorFunc: ICompConstructor,
}

export class ComponentPluginManager {

    static components: { [key: string]: ComponentPlugin } = {};

    static define(plugin: ComponentPlugin) {
        if (typeof plugin.constructorFunc !== "function") {
            throw new Error("'constructorFunc' must be a function");
        }
        if (plugin.type in this.components) {
            throw new Error(`${plugin.type} component is already defined`);
        }

        this.components[plugin.type] = plugin;

        console.log("defined", plugin.type, plugin);
    }

    static getPlugin(type: string): ComponentPlugin {
        if (!(type in ComponentPluginManager.components)) {
            throw new Error(`${type} component not found in plugin registry`);
        }
        return ComponentPluginManager.components[type];
    }

    static getPlugins(): ComponentPlugin[] {
        return Object.values(this.components);
    }
};

ComponentPluginManager.define(CustomRow);
ComponentPluginManager.define(Row);
ComponentPluginManager.define(Heading);
ComponentPluginManager.define(Hero);

