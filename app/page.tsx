"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";
import { GenerateSiteButton } from "@/components/GenerateSiteButton";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { IframePreview } from "@/components/preview/IframePreview";
import { ToggleButton } from "@/components/ToggleButton";
import { OpenHtmlButton } from "@/components/OpenHtmlButton";
import { generateHtml, newSite } from "@/lib/site-generator/generate-html";
import { useDebounce } from "@/hooks/use-debounce";
import { OptionsMenu } from "@/components/options-menu/OptionsMenu";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SiteSettings } from "@/components/site-editor/SiteSettings";
import { ComponentInput } from "@/components/component-editor/component-input/ComponentInput";
import { PreviewEditor } from "@/components/preview/editor/PreviewEditor";

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
            <div className="flex flex-col">
                <OptionsMenu>
                    <ToggleButton
                        onText="Hide iframe Preview"
                        offText="Show iframe Preview"
                        enabled={previewEnabled}
                        onToggle={() => setPreviewEnabled(!previewEnabled)}
                    />
                    <OpenHtmlButton html={previewHtml} />
                    <GenerateSiteButton html={previewHtml} site={site} />
                </OptionsMenu>

                <PreviewEditor comp={site} onChange={setSite} />

                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ResizablePanel defaultSize={previewEnabled ? 50 : 100} minSize={10}>
                        <div className="h-full overflow-y-auto">
                            <div className="p-8 space-y-8">
                                <SiteSettings site={site} onUpdate={setSite} />

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold">Page Content</h2>
                                    <div className="min-h-[400px]">

                                        {/* children component inputs */}
                                        {site.acceptsChildren &&
                                            <div className="p-4">
                                                {
                                                    <ComponentInput
                                                        components={site.childrenDescriptors}
                                                        onChange={(components) => setSite({
                                                            ...site,
                                                            childrenDescriptors: components
                                                        })}
                                                    />
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    {previewEnabled && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={50} minSize={10}>
                                <IframePreview
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
