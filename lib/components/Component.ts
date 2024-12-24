import { AboutProps } from "./About";
import { FooterProps } from "./Footer";
import { HeaderProps } from "./Header";
import { HeroProps } from "./Hero";
import { MarkdownProps } from "./Markdown";
import { ProjectsProps } from "./Projects";

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
