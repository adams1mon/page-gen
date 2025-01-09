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

export default function EditorPage() {
  const { site, setSite } = useSiteStore();
  const {
    showSidebar,
    selectedComponent,
    isFloating,
    selectComponent,
    closeEditor,
    toggleSidebar,
    switchToFloating,
    switchToDocked,
  } = useComponentSelection();

  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [previewHtml, setPreviewHtml] = useState("");
  const debounce = useDebounce();
  const previewDebounceMillis = 100;

  const updateComponent = (updatedComponent: ComponentDescriptor) => {
    const updateComponentInTree = (comp: ComponentDescriptor): ComponentDescriptor => {
      if (comp.id === updatedComponent.id) {
        return updatedComponent;
      }
      if (comp.acceptsChildren) {
        return {
          ...comp,
          childrenDescriptors: comp.childrenDescriptors.map(updateComponentInTree)
        };
      }
      return comp;
    };

    setSite(updateComponentInTree(site));
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
          onToggleSettings={toggleSidebar}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={80} minSize={30}>
          <div className="h-full overflow-auto">
            {activeView === "editor" ? (
              <div className="h-full bg-accent/50">
                <PreviewEditor 
                  comp={site} 
                  onChange={setSite} 
                  onComponentSelect={selectComponent}
                />
              </div>
            ) : (
              <div className="h-full">
                <IframePreview html={previewHtml} site={site} />
              </div>
            )}
          </div>
        </ResizablePanel>

        {showSidebar && !isFloating && 
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={15}>
              <EditorSidebar
                selectedComponent={selectedComponent}
                site={site}
                onSiteUpdate={setSite}
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
          onChange={updateComponent}
          onClose={closeEditor}
          onDock={switchToDocked}
        />
      )}
    </div>
  );
}
