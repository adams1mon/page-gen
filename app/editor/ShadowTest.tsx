import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE, upsertNode } from "@/lib/components/Site";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ShadowEditorContainer } from "./ShadowEditorContainer";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { ComponentContainer, findByIdInTree } from "@/lib/components-meta/ComponentContainer";
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

    const [overlay, setOverlay] = useState(null);

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


        // experiment
        const handleMouseOver = (e: Event) => {
            const target = e.target as HTMLElement;
            console.log("mouseover", target);
            
            if (!target) return;

            const componentRoot = target.closest('[data-id]');
            if (componentRoot) {

                console.log("target element desc", findByIdInTree(comp, componentRoot.dataset.id!));
                
                const rect = componentRoot.getBoundingClientRect();
                setOverlay({
                    id: componentRoot.dataset.id,
                    rect: {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                    },
                });
            }
        };

        const handleMouseOut = () => {
            setOverlay(null);
        };

        shadow.addEventListener('mouseover', handleMouseOver);
        shadow.addEventListener('mouseout', handleMouseOut);

        //return () => {
        //    shadow.removeEventListener('mouseover', handleMouseOver);
        //    shadow.removeEventListener('mouseout', handleMouseOut);
        //};

    }, [comp, ref.current]);

    console.log("render shadowtest", comp);

    if (overlay) {
        console.log("overlay", overlay);
    }
        

    return (
        <>
            <div className="m-4 border-2 border-red-500" ref={ref}></div>
            {
                //comp.type == SITE_TYPE ?
                //    comp.childrenDescriptors.map(createEditorContainers)
                //    :
                //    createEditorContainers(comp)
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

            {overlay && (
                <div
                    style={{
                        position: 'absolute',
                        left: overlay.rect.x + window.scrollX + 'px',
                        top: overlay.rect.y + window.scrollY + 'px',
                        width: overlay.rect.width + 'px',
                        height: overlay.rect.height + 'px',
                        border: '2px solid blue',
                        pointerEvents: 'none',
                    }}
                />
            )}

        </>
    );
}
