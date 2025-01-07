import About from "../components/About";
import Column from "../components/Column";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Hero from "../components/Hero";
import Image from "../components/Image";
import Link from "../components/Link";
import List from "../components/List";
import Markdown from "../components/Markdown";
import Projects from "../components/Projects";
import Row from "../components/Row";
import Text from "../components/Text";
import Gallery from "../components/Gallery";
import Site from "../components/Site";

import { ComponentDescriptor } from "./ComponentDescriptor";

export function updateProps(comp: ComponentDescriptor, props: any): ComponentDescriptor {
    return {
        ...comp,
        props,
    }
}

// holds component descriptors and creates new component descriptors based on the templates
export class ComponentContainer {
    static components: { [type: string]: ComponentDescriptor } = {};
    static jsxFuncs: { [type: string]: React.FunctionComponent<any>} = {};

    static save(
        config: ComponentExport,
    ) {
        this.components[config.type] = config.descriptor;
        this.jsxFuncs[config.type] = config.node;
    }

    static getReactElement(type: string): React.FunctionComponent<any> {
        return this.jsxFuncs[type];
    }

    static createId(type: string): string {
      return `${type}-${Date.now()}`;
    }

    static createInstance(type: string): ComponentDescriptor {
        const desc = this.getDescriptor(type);

        if (!desc) {
            throw new Error(`Component of type ${type} does not exist`);
        }

        return {
            ...desc,
            id: this.createId(type),
        }
    }

  static clone(component: ComponentDescriptor): ComponentDescriptor {
    // Clone children recursively if they exist
    const clonedChildren = component.acceptsChildren 
        ? component.childrenDescriptors.map(child => this.clone(child))
        : [];

    return {
        ...component,
        id: this.createId(component.type),
        childrenDescriptors: clonedChildren
    };
  }

    static getDescriptor(type: string): ComponentDescriptor | undefined {
        return this.components[type];
    }

    // Returns the components that are allowed to be created,
    // so everything besides the Site itself.
    // Otherwise we could have nested Sites, 
    // because the Site is also a component.
    static getAvailableComponents(): ComponentDescriptor[] {
        
        // omit the Site
        const {[Site.type]: _, ...rest} = this.components;

        return Object.values(rest);
    }
}

export interface ComponentExport {
    type: string,
    descriptor: ComponentDescriptor,
    node: React.FunctionComponent<any>,
};

// register the components
ComponentContainer.save(Site);

// container components 
ComponentContainer.save(Container);
ComponentContainer.save(Column);
ComponentContainer.save(Row);
ComponentContainer.save(List);

// basic components
ComponentContainer.save(Text);
ComponentContainer.save(Heading);
ComponentContainer.save(Link);
ComponentContainer.save(Image);

// composite components
ComponentContainer.save(About);
ComponentContainer.save(Footer);
ComponentContainer.save(Header);
ComponentContainer.save(Hero);
ComponentContainer.save(Markdown);
ComponentContainer.save(Projects);
ComponentContainer.save(Gallery);
