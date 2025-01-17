"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FloatingEditor } from "@/components/preview/editor/FloatingEditor";
import { useComponentSelection } from "./hooks/useComponentSelection";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorSidebar } from "./components/EditorSidebar";
import { PreviewEditor } from "@/components/preview/editor/PreviewEditor";
import { IframePreview } from "@/components/preview/IframePreview";
import { useEffect, useState } from "react";
import { generateHtml } from "@/lib/site-generator/generate-html";
import { useDebounce } from "@/hooks/use-debounce";
import { useSiteStore } from "@/lib/store/site-store";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { updateComponentInTree } from "@/lib/components-meta/ComponentContainer";

export default function EditorPage() {
    const { site, setSite } = useSiteStore();
    const {
        selectedComponent,
        isFloating,
        selectComponent,
        closeEditor,
        switchToFloating,
        switchToDocked,
    } = useComponentSelection();

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
            const html = await generateHtml(site);
            setPreviewHtml(html);
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
                    <div className="h-full overflow-auto p-4">
                        {activeView === "editor" ? (
                            <PreviewEditor
                                comp={site}
                                onChange={setSite}
                            />
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
