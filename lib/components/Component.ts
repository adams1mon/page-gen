import { ABOUT_TYPE, AboutProps, defaultAboutProps } from "./About";
import { HEADER_TYPE, HeaderProps, defaultHeaderProps } from "./Header";

export type PropType = HeaderProps | AboutProps;

export interface ComponentConfig {
    id: string;
    type: string;
    props: PropType;
}

const componentConfigFactories: {[k: string]: () => ComponentConfig} = {
    [HEADER_TYPE]: () => ({
        id: `${HEADER_TYPE}-${Date.now()}`, 
        type: HEADER_TYPE, 
        props: defaultHeaderProps
    }),
    [ABOUT_TYPE]: () => ({
        id: `${ABOUT_TYPE}-${Date.now()}`, 
        type: ABOUT_TYPE, 
        props: defaultAboutProps
    }),
}

export function createComponentConfig(type: string): ComponentConfig {
    const factory = componentConfigFactories[type]
    if (!factory) throw new Error(`element with type ${type} not found`);
    return factory();
}

