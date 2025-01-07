"use client";

import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { createReactNode } from "@/lib/site-generator/generate-html";
import {useRef} from "react";


interface CompProps {
    comp: ComponentDescriptor;
}

export default function VanillaRenderer({comp}: CompProps) {

    const ref = useRef(null);

    if (ref.current) {
        startStuff(ref.current, comp);
    }

    return (
        <div ref={ref}>
            
        </div>
    );
}

function startStuff(element: HTMLDivElement, comp: ComponentDescriptor) {
    console.log(element);

    console.log(comp);

    render(comp);
}

function render(e: HTMLElement, comp: ComponentDescriptor) {
    
    if (comp.acceptsChildren) {
        comp.childrenDescriptors.forEach(c => render(e, c));
    }

    //ComponentContainer.getReactElement(comp.type);

    const node = createReactNode
}

