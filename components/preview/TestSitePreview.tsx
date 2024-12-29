"use client"

import { ComponentDescriptor } from "@/lib/components/ComponentContainer";
import { createReactNode } from "@/lib/site-generator/generate-html";
import { Play } from "next/font/google";
import { MutableRefObject, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
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

    //useEffect(() => {
    //
    //    if (!isClient) return;
    //
    //    if (!shadowRef.current && shadow) return;
    //
    //    const sh: ShadowRoot = shadowRef.current!.attachShadow({ mode: "open" });
    //
    //    const span = document.createElement("span");
    //    span.textContent = "I'm in the shadow DOMMMM";
    //    sh.appendChild(span);
    //
    //    setShadow(sh);
    //
    //    //const upper = document.querySelector("button#upper");
    //    //upper.addEventListener("click", () => {
    //    //    const spans = Array.from(document.querySelectorAll("span"));
    //    //    for (const span of spans) {
    //    //        span.textContent = span.textContent.toUpperCase();
    //    //    }
    //    //});
    //    //
    //}, [shadowRef.current]);

    //useEffect(() => {
    //    console.log("rendering site");
    //    if (!shadow) return;
    //
    //    const element = createReactNode(site);
    //    shadow.innerHTML = renderToStaticMarkup(element);
    //    console.log("rendered");
    //}, [site, shadow]);

    useEffect(() => {
        console.log(shadowRef);
        console.log(shadow);

        if (!shadowRef.current || shadow) return;

        const sh: ShadowRoot = shadowRef.current!.attachShadow({ mode: "open" });

        const span = document.createElement("span");
        span.textContent = "I'm in the shadow DOMMMM";
        sh.appendChild(span);

        setShadow(sh);

    }, [shadowRef]);

    return (
        <div className="h-full bg-gray-50">
            {
                !isClient ?
                    <p>Prerendered here...</p>
                    :
                    //node
                    //<site.jsxFunc {...site.props} />
                    //<template shadowrootmode="open">
                    //    <p>shadow doem yeah</p>
                    //</template>
                    <div id="preview-root" ref={shadowRef}>
                    </div>
            }
        </div>
    );
}
