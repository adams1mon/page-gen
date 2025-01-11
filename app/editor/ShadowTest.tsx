import { ComponentContainer, insertChild } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE, createHtmlSkeleton, upsertHtmlNode, setBodyHtml, processTailwindCSS } from "@/lib/components/Site";
import { ReactNode, createElement, useEffect, useRef, useState } from "react";
import { EditorContainer } from "../../components/preview/editor/EditorContainer";
import { createPortal } from "react-dom";
import { createHtml, createReactNode } from "@/lib/site-generator/generate-html";
import { renderToStaticMarkup } from "react-dom/server";

export type CompFunc = (comp: ComponentDescriptor) => void;

function wrapTreeWithEditor(
    comp: ComponentDescriptor,
): ReactNode {
    if (comp.acceptsChildren) {
        comp.props = {
            ...comp.props,
            children: comp.childrenDescriptors.map(wrapTreeWithEditor),
        };
    }

    return (
        <EditorContainer
            key={comp.id}
            component={comp}
        >
            {createElement(
                ComponentContainer.getReactElement(comp.type),
                { ...comp.props, key: comp.id },
            )}
        </EditorContainer>
    );
}

interface CompProps {
    comp: ComponentDescriptor;
    onChange: CompFunc;
}

export function ShadowTest({ comp, onChange }: CompProps) {

    const ref = useRef(null);
    const [root, setRoot] = useState();

    console.log("rendering shadow test");

    useEffect(() => {

        if (ref.current) {

            if (!ref.current.shadowRoot) {
                const shadow = ref.current.attachShadow({ mode: "open" });

                console.log("attached shadow");

                if (comp.type == SITE_TYPE) {
                    const sheet = new CSSStyleSheet();
                    sheet.replaceSync(comp.props.styles);
                    shadow.adoptedStyleSheets = [sheet];
                    console.log("added styles");
                }
            }

            const html = createHtml(comp);

            upsertHtmlNode(ref.current.shadowRoot, html);
            
            console.log("shadow exists");

            // Create a container for your React app inside the shadow DOM
            //const reactContainer = document.createElement("div");
            //shadow.appendChild(reactContainer);
            //

            //if (root) {
            //    root.render(
            //        <>
            //            {comp.type === SITE_TYPE
            //                ? comp.childrenDescriptors.map(createReactNode)
            //                : createReactNode(comp)
            //            }
            //        </>
            //    );
            //}
        }

    }, [comp, root]);


    return (
        <div className="m-4 border-2 border-red-500" ref={ref}>
            {
                //ref.current && ref.current.shadowRoot &&
                    
                //createPortal(
                //    <>
                //        {comp.type === SITE_TYPE
                //            //? comp.childrenDescriptors.map(createReactNode)
                //            //: createReactNode(comp)
                //            ? comp.childrenDescriptors.map(wrapTreeWithEditor)
                //            : wrapTreeWithEditor(comp)
                //        }
                //    </>,
                //    ref.current.shadowRoot,
                //)

                //createPortal(
                //    <>
                //        {comp.type === SITE_TYPE
                //            //? comp.childrenDescriptors.map(createReactNode)
                //            //: createReactNode(comp)
                //            ? comp.childrenDescriptors.map(wrapTreeWithEditor)
                //            : wrapTreeWithEditor(comp)
                //        }
                //    </>,
                //    ref.current.shadowRoot,
                //)

                //{comp.type === SITE_TYPE
                //  ? comp.childrenDescriptors.map(wrapTreeWithEditor)
                //  : wrapTreeWithEditor(comp)
                //}
                //{comp.acceptsChildren && (
                //  <div className="p-4">
                //    <ComponentDivider
                //      onInsert={c => onChange(insertChild(comp, c))}
                //    />
                //  </div>
                //)}
            }
        </div>
    );
}
