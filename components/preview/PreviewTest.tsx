"use client";

import { ComponentContainer, insertChild, removeChild, updateChild } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE } from "@/lib/components/Site";
import { ReactNode, createElement } from "react";
import { ComponentDivider } from "../component-editor/component-input/ComponentDivider";
import { ComponentEditor } from "./editor/ComponentEditor";
import { cn } from "@/lib/utils";

export type CompFunc = (comp: ComponentDescriptor) => void;

function wrapTreeWithEditor(comp: ComponentDescriptor, onChange: CompFunc, onRemove?: CompFunc, z: number = 10): ReactNode {
    if (comp.acceptsChildren) {
        comp.props = {
            ...comp.props,
            children: comp.childrenDescriptors.map(c => wrapTreeWithEditor(
                c, 
                updated => onChange(updateChild(comp, updated)), 
                toRemove => onChange(removeChild(comp, toRemove)),
                z+10,
            )),
        };
    }

    return (
        <ComponentEditor key={comp.id} component={comp} onChange={onChange} onRemove={onRemove} z={z}>
            {createElement(
                ComponentContainer.getReactElement(comp.type),
                { ...comp.props, key: comp.id },
            )}
        </ComponentEditor>
    );
}

interface CompProps {
    comp: ComponentDescriptor;
    onChange: CompFunc;
}


export default function PreviewTest({ comp, onChange }: CompProps) {

    return (
        <div className="m-4">
            {comp.type === SITE_TYPE
                ? comp.childrenDescriptors.map(d => wrapTreeWithEditor(
                    d, 
                    updated => onChange(updateChild(comp, updated)), 
                    toRemove => onChange(removeChild(comp, toRemove)),
                ))
                : wrapTreeWithEditor(comp, onChange)
            }
            {comp.acceptsChildren && (
                <div className="p-4">
                    <ComponentDivider
                        onInsert={c => onChange(insertChild(comp, c))}
                    />
                </div>
            )}
        </div>
    );
}
