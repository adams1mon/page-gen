import { ABOUT_TYPE, AboutProps, defaultAboutProps } from "./About";
import { HEADER_TYPE, HeaderProps, defaultHeaderProps } from "./Header";
import { HERO_TYPE, HeroProps, defaultHeroProps } from "./Hero";
import { MARKDOWN_TYPE, MarkdownProps, defaultMarkdownProps } from "./Markdown";
import { PROJECTS_TYPE, ProjectsProps, defaultProjectProps } from "./Projects";
import { FOOTER_TYPE, FooterProps, defaultFooterProps } from "./Footer";

export type PropType = HeaderProps 
| HeroProps
| AboutProps
| ProjectsProps
| MarkdownProps
| FooterProps
;

export interface ComponentConfig {
    id: string;
    type: string;
    props: PropType;
}

// TODO: create a "component container" on which
// components can be registered, they provide factory methods and generateHtml methods
const componentConfigFactories: {[k: string]: () => ComponentConfig} = {
    [HEADER_TYPE]: () => ({
        id: `${HEADER_TYPE}-${Date.now()}`, 
        type: HEADER_TYPE, 
        props: defaultHeaderProps,
    }),
    [HERO_TYPE]: () => ({
        id: `${HERO_TYPE}-${Date.now()}`, 
        type: HERO_TYPE, 
        props: defaultHeroProps,
    }),
    [ABOUT_TYPE]: () => ({
        id: `${ABOUT_TYPE}-${Date.now()}`, 
        type: ABOUT_TYPE, 
        props: defaultAboutProps,
    }),
    [PROJECTS_TYPE]: () => ({
        id: `${PROJECTS_TYPE}-${Date.now()}`, 
        type: PROJECTS_TYPE, 
        props: defaultProjectProps,
    }),
    [MARKDOWN_TYPE]: () => ({
        id: `${MARKDOWN_TYPE}-${Date.now()}`, 
        type: MARKDOWN_TYPE, 
        props: defaultMarkdownProps,
    }),
    [FOOTER_TYPE]: () => ({
        id: `${FOOTER_TYPE}-${Date.now()}`, 
        type: FOOTER_TYPE, 
        props: defaultFooterProps,
    }),
}

export function createComponentConfig(type: string): ComponentConfig {
    const factory = componentConfigFactories[type]
    if (!factory) throw new Error(`element with type ${type} not found`);
    return factory();
}

