"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ComponentEditor } from "@/components/editor/ComponentEditor";
import { useState, useEffect } from "react";
import { GenerateSiteButton } from "@/components/GenerateSiteButton";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ComponentDescriptor } from "@/lib/components/ComponentContainer";
import { SitePreview } from "@/components/preview/SitePreview";
import { PreviewToggle } from "@/components/preview/PreviewToggle";
import { OpenInNewTab } from "@/components/preview/OpenInNewTab";
import { generateHtml, newSite } from "@/lib/site-generator/generate-html";
import { useDebounce } from "@/hooks/use-debounce";

export default function Home() {
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [previewEnabled, setPreviewEnabled] = useState(true);
    const [site, setSite] = useState<ComponentDescriptor>(newSite());
    const debounce = useDebounce();
    const previewDebounceMillis = 100;

    const debouncePreview = () => debounce(() => {
        if (previewEnabled) {
            (async () => {
                const html = await generateHtml(site);
                setPreviewHtml(html);
            })();
        }
    }, previewDebounceMillis);

    useEffect(debouncePreview, [site, previewEnabled]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="h-screen flex flex-col">
                <div className="border-b bg-background">
                    <div className="flex justify-between items-center p-4">
                        <h1 className="text-2xl font-bold">Portfolio Builder</h1>
                        <div className="flex items-center gap-4">
                            <PreviewToggle
                                enabled={previewEnabled}
                                onToggle={() => setPreviewEnabled(!previewEnabled)}
                            />
                            <OpenInNewTab html={previewHtml} />
                            <GenerateSiteButton html={previewHtml} site={site} />
                        </div>
                    </div>
                </div>

                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ResizablePanel defaultSize={previewEnabled ? 50 : 100} minSize={10}>
                        <div className="h-full overflow-y-auto">
                            <div className="p-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center h-full min-h-[400px]">
                                        <ComponentEditor
                                            index={0}
                                            component={site}
                                            onUpdate={setSite}
                                            moveComponent={
                                                // unused for the site
                                                () => { }
                                            }
                                            onDelete={
                                                // unused for the site
                                                () => { }
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    {previewEnabled && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={50} minSize={10}>
                                <SitePreview
                                    html={previewHtml}
                                    site={site}
                                />
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </DndProvider>
    );
}


