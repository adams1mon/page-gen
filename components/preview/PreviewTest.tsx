"use client";

import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE } from "@/lib/components/Site";
import { ReactNode, createElement, useState } from "react";
import { ComponentInput } from "../component-editor/component-input/ComponentInput";
import { PropInputs } from "../component-editor/dynamic-input/PropInputs";
import { ComponentDivider } from "../component-editor/component-input/ComponentDivider";

type ChangeFunc = (comp: ComponentDescriptor) => void;

interface CompProps {
    comp: ComponentDescriptor;
    onChange: ChangeFunc;
};

function wrapTreeWithEditor(comp: ComponentDescriptor, onChange: ChangeFunc): ReactNode {
    if (comp.acceptsChildren) {
        comp.props = {
            ...comp.props,
            children: comp.childrenDescriptors.map((c) => wrapTreeWithEditor(c, onChange)),
        };
    }

    return (
        <EditorOverlay component={comp} onChange={onChange}>
            {
                createElement(
                    ComponentContainer.getReactElement(comp.type),
                    { ...comp.props, key: comp.id },
                )
            }
        </EditorOverlay>
    );
}


interface EditorOverlayProps extends React.PropsWithChildren {
    component: ComponentDescriptor;
    onChange: ChangeFunc;
};

function EditorOverlay({ component, onChange, children }: EditorOverlayProps) {

    const [settingsOpen, setSettingsOpen] = useState(false);

    console.log(component.type, "editor rerender");

    return (
        <div
            className="relative outline outline-2 outline-red-500 hover:outline-dashed"
            onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen(prev => !prev);
            }}
        >
            {settingsOpen &&
                <div className="absolute top-0 right-0 bg-white">
                    <PropInputs
                        propsDescriptor={component.propsDescriptor}
                        props={component.props}
                        onChange={newComponentProps => onChange(
                            {
                                ...component,
                                props: newComponentProps,
                            }
                        )}
                    />
                    {component.acceptsChildren &&
                        <div className="p-4" onClick={e => e.stopPropagation()}>
                            {
                                <ComponentInput
                                    components={component.childrenDescriptors}
                                    onChange={components => onChange({
                                        ...component,
                                        childrenDescriptors: components,
                                    })}
                                />
                            }
                        </div>
                    }
                </div>
            }
            {component.acceptsChildren && component.childrenDescriptors.length == 0 &&
                <div className="p-4">
                    {
                        <ComponentDivider
                            onInsert={(comp) => {
                                onChange({
                                    ...component,
                                    childrenDescriptors: [comp],
                                })
                            }}
                        />
                    }
                </div>
            }

            {children}
        </div>
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

    return (
        <div className="m-4">
            {
                comp.type == SITE_TYPE ?
                    comp.childrenDescriptors.map(d =>
                        wrapTreeWithEditor(d, updateChild)
                    )
                    :
                    wrapTreeWithEditor(comp, onChange)
            }
        </div>
    );
}

