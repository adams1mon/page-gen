"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FloatingEditor } from "@/components/preview/editor/FloatingEditor";
import { useComponentSelection } from "./hooks/useComponentSelection";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorSidebar } from "./components/EditorSidebar";
import { IframePreview } from "@/components/preview/IframePreview";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSiteStore } from "@/lib/store/site-store";
import { ShadowTest } from "./ShadowTest";
import { useEditorPreferences } from "@/lib/store/editor-preferences";

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

    const updatePage = () => {
        setSite(site.clone());
        console.log("update page");
    };

    useEffect(() => {
        if (activeView != "preview") return;

        debounce(async () => {
            const htmlStr = "<!DOCTYPE html>\n" + site.htmlRoot.outerHTML;
            setPreviewHtml(htmlStr);
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
                                    <ShadowTest onChange={updatePage} />
                                //<PreviewEditor
                                //    comp={site}
                                //    onChange={setSite}
                                //    //onChange={() => console.log("add")}
                                ///>
                                }
                            </>
                        ) : (
                            <IframePreview html={previewHtml} />
                        )}
                    </div>
                </ResizablePanel>

                {selectedComponent && !isFloating &&
                    <>
                        <ResizableHandle withHandle />
                        <ResizablePanel id="editor-sidebar" order={1} defaultSize={40} minSize={15}>
                            <EditorSidebar
                                component={selectedComponent}
                                onChange={updatePage}
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
                    onChange={updatePage}
                    onClose={closeEditor}
                    onDock={switchToDocked}
                />
            )}
        </div>
    );
}
