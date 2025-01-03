import { renderToStaticMarkup } from "react-dom/server";
import { ComponentContainer, ComponentDescriptor } from "../components/ComponentContainer";
import React, { ReactElement, createElement } from "react";
import { SITE_TYPE } from "../components/Site";
import * as Babel from "@babel/standalone";

export function newSite(): ComponentDescriptor {
    return ComponentContainer.createInstance(SITE_TYPE);
}

export function createReactNode(comp: ComponentDescriptor): ReactElement {

    // generate child components recursively if there are child descriptors
    if (comp.props?.childrenDesc && comp.props.childrenDesc.length > 0) {
        comp.props = {
            ...comp.props,

            // adds the 'key' prop to the created elements
            children: (comp.props.childrenDesc as ComponentDescriptor[])
                //.map(c => createElement(c.jsxFunc, { ...c.props, key: c.id }))
                .map(createReactNode)
        };
    }

    //const w = wrapFunctionString(comp.jsxFunc);
    //const f = eval(w);
    //console.log(f.toString());
    //

    //console.log(React.version);

    let jsxElement;
    if (typeof comp.jsxFunc === "string") {
        console.log("custom component", comp.name);
        
        jsxElement = jsxToJs(comp.jsxFunc);
    } else if (typeof comp.jsxFunc === "function") {
        console.log("predefined component", comp.name);
        jsxElement = comp.jsxFunc;
    } else {
        throw Error("jsxFunc is not a string or a function");
    }

    // string JSX -> 
    // assign the 'id' of the component to the React 'key' prop
    //return createElement(comp.jsxFunc, { ...comp.props, key: comp.id });
    return createElement(jsxElement, { ...comp.props, key: comp.id });
}

export async function generateHtml(comp: ComponentDescriptor) {
    const element = createReactNode(comp);
    const html = renderToStaticMarkup(element);
    return html;
}

// Example: JSX string
const jsxString = `
      function MyComponent() {
        return <div>Hello, static markup!</div>;
      }
    `;

function jsxToJs(jsxStr: string) {
    // Transform the JSX string into a usable React component
    const Component = Babel.transform(jsxStr, { presets: ['react'] }).code;
    return new Function(`return ${Component}`)();
}

