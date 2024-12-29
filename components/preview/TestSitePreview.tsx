"use client"

import { ComponentDescriptor } from "@/lib/components/ComponentContainer";
import { createReactNode } from "@/lib/site-generator/generate-html";
import { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";


interface SitePreviewProps {
    site: ComponentDescriptor;
}

export function TestSitePreview({ site }: SitePreviewProps) {

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const [shadow, setShadow] = useState<ShadowRoot | null>(null);

    const shadowRef = useRef(null);

    useEffect(() => {

        if (!isClient) return;

        if (!shadowRef.current && shadow) return;

        const sh: ShadowRoot = shadowRef.current!.attachShadow({ mode: "open" });

        const span = document.createElement("span");
        span.textContent = "I'm in the shadow DOM";
        sh.appendChild(span);

        setShadow(sh);

        //const upper = document.querySelector("button#upper");
        //upper.addEventListener("click", () => {
        //    const spans = Array.from(document.querySelectorAll("span"));
        //    for (const span of spans) {
        //        span.textContent = span.textContent.toUpperCase();
        //    }
        //});
        //
    }, [shadowRef.current]);

    //useEffect(() => {
    //    if (!shadow) return;
    //    const element = createReactNode(site);
    //    shadow.innerHTML = renderToStaticMarkup(element);
    //}, [site]);

    //const node = createReactNode(site);
    return (
        <div className="h-full bg-gray-50">
            {
                !isClient ?
                <p>Prerendered here...</p>
                :

                //node
                //<site.jsxFunc {...site.props} />
                <div id="preview-root" ref={shadowRef}>

                    <template shadowrootmode="open">
                        <p>shadow doem yeah</p>
                    </template>
                </div>
            }
        </div>
    );
}
