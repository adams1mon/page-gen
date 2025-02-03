import { ReactNode } from "react";
import { PropContentType } from "./PropsDescriptor";
import { PropInputPluginManager, PropInputProps } from "./PropInputPluginManager";

export class PropInputFactory {

    static createInput(contentType: PropContentType, propInputProps: PropInputProps<any>): ReactNode {
        const plugin = PropInputPluginManager.getPlugin(contentType);

        return plugin.jsxFunc(propInputProps);
    }
};
