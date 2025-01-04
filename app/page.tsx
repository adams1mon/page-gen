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
import { SitePreview } from "@/components/preview/SitePreview";
import { PreviewToggle } from "@/components/preview/PreviewToggle";
import { OpenInNewTab } from "@/components/preview/OpenInNewTab";
import { generateHtml, newSite } from "@/lib/site-generator/generate-html";
import { useDebounce } from "@/hooks/use-debounce";
import { ComponentEditor } from "@/components/component-editor/ComponentEditor";
import { OptionsMenu } from "@/components/options-menu/OptionsMenu";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SiteSettings } from "@/components/site-editor/SiteSettings";
import { ObjectDesc } from "@/lib/components-meta/PropsDescriptor";
import { PropInputWrapper } from "@/components/component-editor/dynamic-input/PropInputWrapper";
import { ComponentInput } from "@/components/component-editor/component-input/ComponentInput";

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
                <OptionsMenu>
                    <PreviewToggle
                        enabled={previewEnabled}
                        onToggle={() => setPreviewEnabled(!previewEnabled)}
                    />
                    <OpenInNewTab html={previewHtml} />
                    <GenerateSiteButton html={previewHtml} site={site} />
                </OptionsMenu>

                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ResizablePanel defaultSize={previewEnabled ? 50 : 100} minSize={10}>
                        <div className="h-full overflow-y-auto">
                            <div className="p-8 space-y-8">
                                <SiteSettings site={site} onUpdate={setSite} />

                                {
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold">Page Content</h2>
                                        <div className="min-h-[400px]">

                                            {
                                                //<ComponentEditor
                                                //    index={0}
                                                //    component={(site.propsDescriptor as ObjectDesc).child}
                                                //    onUpdate={setSite}
                                                //    moveComponent={() => {}}
                                                //    onDelete={null}
                                                ///>

                                            }
                                            {/* children component inputs */}
                                            {site.acceptsChildren &&
                                                <PropInputWrapper>
                                                    <div className="p-4">
                                                        <ComponentInput
                                                            components={site.childrenDescriptors}
                                                            onChange={(components) => setSite({
                                                                ...site,
                                                                childrenDescriptors: components
                                                            })}
                                                        />
                                                    </div>
                                                </PropInputWrapper>
                                            }
                                        </div>
                                    </div>
                                }
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
