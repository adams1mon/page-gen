import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE,upsertNode } from "@/lib/components/Site";
import { ReactNode, useEffect, useRef } from "react";
import { ShadowEditorContainer } from "./ShadowEditorContainer";
export type CompFunc = (comp: ComponentDescriptor) => void;

function wrapWithEditorContainer(
    comp: ComponentDescriptor,
): ReactNode {

    if (comp.acceptsChildren) {
        return (
            <>
                {comp.childrenDescriptors.map(wrapWithEditorContainer)}
            </>
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

export function ShadowTest({ comp} : CompProps) {

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

        console.log(comp.domNode);

        if (!comp.domNode) {
            console.log("no DOM node", comp);
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
                    comp.childrenDescriptors.map(wrapWithEditorContainer)
                    :
                    wrapWithEditorContainer(comp)
            }

        </>
    );
}
