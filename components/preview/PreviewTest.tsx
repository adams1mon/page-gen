"use client";

import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE } from "@/lib/components/Site";
import { ReactNode, createElement } from "react";
import { ComponentDivider } from "../component-editor/component-input/ComponentDivider";
import { ComponentEditor } from "./editor/ComponentEditor";

export type CompFunc = (comp: ComponentDescriptor) => void;

interface CompProps {
    comp: ComponentDescriptor;
    onChange: CompFunc;
}

function wrapTreeWithEditor(comp: ComponentDescriptor, onChange: CompFunc, onRemove?: CompFunc): ReactNode {
    if (comp.acceptsChildren) {
        const updateChild = (updatedComponent: ComponentDescriptor) => {
            const newComponents = comp.childrenDescriptors.map(component =>
                component.id === updatedComponent.id ? updatedComponent : component
            );
            onChange({
                ...comp,
                childrenDescriptors: newComponents,
            });
        };

        const removeChild = (compToRemove: ComponentDescriptor) => {
            onChange({
                ...comp,
                childrenDescriptors: comp.childrenDescriptors.filter(c => c.id !== compToRemove.id),
            });
        }

        comp.props = {
            ...comp.props,
            children: comp.childrenDescriptors.map(c => wrapTreeWithEditor(c, updateChild, removeChild)),
        };
    }

    return (
        <ComponentEditor key={comp.id} component={comp} onChange={onChange} onRemove={onRemove}>
            {createElement(
                ComponentContainer.getReactElement(comp.type),
                { ...comp.props, key: comp.id },
            )}
        </ComponentEditor>
    );
}

export default function PreviewTest({ comp, onChange }: CompProps) {
    const updateChild = (updatedComp: ComponentDescriptor) => {
        const newDescriptors = comp.childrenDescriptors.map(old =>
            old.id === updatedComp.id ? updatedComp : old
        );
        onChange({
            ...comp,
            childrenDescriptors: newDescriptors,
        });
    };

    const removeChild = (compToRemove: ComponentDescriptor) => {
        onChange({
            ...comp,
            childrenDescriptors: comp.childrenDescriptors.filter(c => c.id !== compToRemove.id),
        });
    }

    return (
        <div className="m-4">
            {comp.type === SITE_TYPE
                ? comp.childrenDescriptors.map(d => wrapTreeWithEditor(d, updateChild, removeChild))
                : wrapTreeWithEditor(comp, onChange)
            }
            {comp.acceptsChildren && (
                <div className="p-4">
                    <ComponentDivider
                        onInsert={c => onChange({
                            ...comp,
                            childrenDescriptors: [...comp.childrenDescriptors, c]
                        })}
                    />
                </div>
            )}
        </div>
    );
}
