"use client";

import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE } from "@/lib/components/Site";
import { ReactNode, createElement, useState } from "react";
import { ComponentEditor } from "../component-editor/ComponentEditor";
import { ComponentInput } from "../component-editor/component-input/ComponentInput";
import { PropInputs } from "../component-editor/dynamic-input/PropInputs";

interface CompProps {
    comp: ComponentDescriptor;
};

function wrapTreeWithEditor(comp: ComponentDescriptor): ReactNode {
    if (comp.acceptsChildren) {
        comp.props = {
            ...comp.props,
            children: comp.childrenDescriptors.map(wrapTreeWithEditor),
        };
    }

    return (
        <EditorOverlay component={comp}>
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
    component: ComponentDescriptor,
};

function EditorOverlay(props: EditorOverlayProps) {

    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <div
            className="relative outline outline-2 outline-red-500 hover:outline-dashed"
            onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen(prev => !prev);
            }}
        >
            {settingsOpen &&
                <div className="absolute top-0 right-0 z-10 bg-white">
                    <PropInputs
                        propsDescriptor={props.component.propsDescriptor}
                        props={props.component.props}
                        onChange={(p) => console.log("props change", p)}
                    />
                    {props.component.acceptsChildren &&
                        <div className="p-4">
                            {
                                <ComponentInput
                                    components={props.component.childrenDescriptors}
                                    //onChange={(components) => setSite({
                                    //    ...site,
                                    //    childrenDescriptors: components
                                    //})}
                                    onChange={(c) => console.log("changed", c)}
                                />
                            }
                        </div>
                    }
                </div>
            }
            {props.children}
        </div>
    );
}

export default function PreviewTest({ comp }: CompProps) {

    // also populates comp.props.children as a side effect

    return (
        <div className="m-4">
            {

                comp.type == SITE_TYPE ?
                    comp.childrenDescriptors.map(d =>
                        wrapTreeWithEditor(d)
                    )
                    :
                    wrapTreeWithEditor(comp)
            }

        </div>
    );
}

