import { FunctionComponent } from "react";
import { PropContentType, PropsDescriptorLeaf } from "./PropsDescriptor";
import NumberInput from "./inputs/NumberInput";
import StringInput from "./inputs/StringInput";

// an input should only deal with leaf prop descriptors, not with composite ones
export interface PropInputProps<T> {
    propsDescriptor: PropsDescriptorLeaf,
    prop: T,
    onChange: (prop: T) => void,
    debounceMillis?: number,
}

// an input which handles the specific content type 
// (text, title, number, style)
export interface PropInputPlugin {

    // the content types this input can be used for
    contentTypes: PropContentType[],

    // TODO: change any into T?
    jsxFunc: FunctionComponent<PropInputProps<any>>,
}

export class PropInputPluginManager {

    static propInputs: { [key in PropContentType]?: PropInputPlugin} = {};

    static define(plugin: PropInputPlugin) {
        if (typeof plugin.jsxFunc !== "function") {
            throw new Error("'constructorFunc' must be a function");
        }

        for (const c of plugin.contentTypes) {
            if (c in this.propInputs) {
                throw new Error(`${c} prop input type is already defined`);
            }
            this.propInputs[c] = plugin;
            console.log("defined", c, plugin);
        }
    }

    static getPlugin(contentType: PropContentType): PropInputPlugin {
        if (!(contentType in PropInputPluginManager.propInputs)) {
            throw new Error(`${contentType} prop input not found in plugin registry`);
        }
        // the check above should ensure that the object exists
        return PropInputPluginManager.propInputs[contentType]!;
    }
};

PropInputPluginManager.define(NumberInput);
PropInputPluginManager.define(StringInput);
