"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FloatingEditor } from "@/components/preview/editor/FloatingEditor";
import { useComponentSelection } from "./hooks/useComponentSelection";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorSidebar } from "./components/EditorSidebar";
import { PreviewEditor } from "@/components/preview/editor/PreviewEditor";
import { IframePreview } from "@/components/preview/IframePreview";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSiteStore } from "@/lib/store/site-store";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { updateComponentInTree } from "@/lib/components-meta/ComponentContainer";
import { ShadowTest } from "./ShadowTest";
import { useEditorPreferences } from "@/lib/store/editor-preferences";
import { createNavigationMenuScope } from "@radix-ui/react-navigation-menu";
import { createSiteSkeleton } from "@/lib/components/Site";

export default function EditorPage() {
    const { site, setSite } = useSiteStore();
    const {
        selectedComponent,
        selectComponent,
        closeEditor,
    } = useComponentSelection();

    const {
        isFloating,
        switchToFloating,
        switchToDocked,
    } = useEditorPreferences();

    const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
    const [previewHtml, setPreviewHtml] = useState("");
    const debounce = useDebounce();
    const previewDebounceMillis = 100;

    const updateComponent = (updatedComponent: ComponentDescriptor) => {
        setSite(updateComponentInTree(site, updatedComponent));
    };

    useEffect(() => {
        if (activeView != "preview") return;

        debounce(async () => {
            //const html = await generateHtml(site);
            //setPreviewHtml(html);

            // TODO: clone the site dom node?
            let body = createSiteSkeleton(site.props);
            let html = body.closest("html");
            body.replaceWith(site.domNode); // replaces the shadow root parent...
            
            //let html = site.domNode?.closest("html")?.outerHTML;
            if (!html) {
                console.warn("no closest HTML node found when trying to get HTML from the site");
                return;
            }
            const htmlStr = "<!DOCTYPE html>\n" + html.outerHTML;

            setPreviewHtml(htmlStr);

            console.log("preview HTML");
            console.log(htmlStr);

        }, previewDebounceMillis);

    }, [site, activeView]);

    return (
        <div className="h-screen flex flex-col">
            <div className="sticky top-0 left-0 right-0 z-50 bg-background">
                <EditorToolbar
                    onToggleSettings={() => selectComponent(site)}
                    activeView={activeView}
                    onViewChange={setActiveView}
                />
            </div>


            <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel id="preview" order={0} minSize={30}>



                    <div className="h-full overflow-hidden">
                        {activeView === "editor" ? (
                            <>
                                {
                                    <ShadowTest />
                                //<PreviewEditor
                                //    comp={site}
                                //    onChange={setSite}
                                //    //onChange={() => console.log("add")}
                                ///>
                                }
                            </>
                        ) : (
                            <IframePreview html={previewHtml} site={site} />
                        )}
                    </div>
                </ResizablePanel>

                {selectedComponent && !isFloating &&
                    <>
                        <ResizableHandle withHandle />
                        <ResizablePanel id="editor-sidebar" order={1} defaultSize={40} minSize={15}>
                            <EditorSidebar
                                component={selectedComponent}
                                onComponentUpdate={updateComponent}
                                onPopOut={switchToFloating}
                                onClose={closeEditor}
                            />
                        </ResizablePanel>
                    </>
                }
            </ResizablePanelGroup>

            {selectedComponent && isFloating && (
                <FloatingEditor
                    component={selectedComponent}
                    onComponentUpdate={updateComponent}
                    onClose={closeEditor}
                    onDock={switchToDocked}
                />
            )}
        </div>
    );
}
