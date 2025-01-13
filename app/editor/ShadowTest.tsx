import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE, upsertNode } from "@/lib/components/Site";
import { ReactNode, useEffect, useRef } from "react";
import { ShadowEditorContainer } from "./ShadowEditorContainer";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
export type CompFunc = (comp: ComponentDescriptor) => void;

function createEditorContainers(
    comp: ComponentDescriptor,
): ReactNode {

    if (comp.acceptsChildren) {
        return (
            <ShadowEditorContainer key={comp.id} component={comp}>
                {comp.childrenDescriptors.map(createEditorContainers)}
            </ShadowEditorContainer>
        );
    }

    return (
        <ShadowEditorContainer key={comp.id} component={comp} />
    );
}

interface CompProps {
    comp: ComponentDescriptor;
    onChange: CompFunc;
}

export function ShadowTest({ comp, onChange }: CompProps) {

    const ref = useRef(null);

    useEffect(() => {

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;

        if (comp.type == SITE_TYPE) {
            if (comp.props.styles) {
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(comp.props.styles);
                shadow.adoptedStyleSheets = [sheet];
                console.log("added styles");
            }
        }

        if (!comp.domNode) {
            console.warn("no DOM node", comp);
        } else {
            upsertNode("html", shadow, comp.domNode);
        }

    }, [comp, ref.current]);

    console.log("render shadowtest", comp);

    return (
        <>
            <div className="m-4 border-2 border-red-500" ref={ref}></div>
            {
                comp.type == SITE_TYPE ?
                    comp.childrenDescriptors.map(createEditorContainers)
                    :
                    createEditorContainers(comp)
            }

            {comp.acceptsChildren && (
                <div className="p-4">
                    <ComponentDivider
                        onInsert={c => {
                            ComponentContainer.addChild(comp, c);
                            onChange(comp);
                        }}
                    />
                </div>
            )}

        </>
    );
}
