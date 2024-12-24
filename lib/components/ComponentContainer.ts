import { ComponentConfig, PropType } from "./Component";

export class ComponentContainer {
    static configFactories: { [key: string]: () => ComponentConfig } = {}
    static toHtmls: { [key: string]: (props: any) => string } = {}
    static icons: { [key: string]: (props: any) => string } = {}

    static register(
        type: string,
        createConfig: () => ComponentConfig,
        toHtml: (props: any) => string,
    ) {
        ComponentContainer.configFactories[type] = createConfig;
        ComponentContainer.toHtmls[type] = toHtml;
    }

    static createComponentConfig(type: string): ComponentConfig {
        const func = ComponentContainer.configFactories[type]
        if (!func) throw new Error(`component ${type} doesn't have a createConfig function registered`);
        return func();
    }

    static toHtml(type: string, props: PropType): string {
        const func = ComponentContainer.toHtmls[type];
        if (!func) throw new Error(`component ${type} doesn't have a toHtml function registered`);
        return func(props)
    }
}

