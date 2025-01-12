import { ComponentContainer, insertChild } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE, createHtmlSkeleton, upsertNode, setBodyHtml, processTailwindCSS } from "@/lib/components/Site";
import { ReactNode, createElement, useEffect, useRef, useState } from "react";
import { EditorContainer } from "../../components/preview/editor/EditorContainer";
import { createPortal } from "react-dom";
import { createHtml, createReactNode } from "@/lib/site-generator/generate-html";
import { renderToStaticMarkup } from "react-dom/server";
import { ShadowEditorContainer } from "./ShadowEditorContainer";
import { EditorContextMenu } from "@/components/preview/editor/EditorContextMenu";

export type CompFunc = (comp: ComponentDescriptor) => void;


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
            <ShadowEditorContainer comp={comp} />

            <EditorContextMenu
                component={comp}
                overlayEnabled={false}
                onOverlayToggle={() => console.log("toggle overlay")}

                //onEdit={() => selectComponent(c)}
                onEdit={() => console.log("edit")}

                onInsert={() => console.log("insert")}
                onRemove={() => console.log("remove")}
            >
                <div className="m-4 border-2 border-red-500" ref={ref}></div>
            </EditorContextMenu>
        </>
    );
}
