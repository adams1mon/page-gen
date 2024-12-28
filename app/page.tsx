"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ComponentEditor } from "@/components/editor/ComponentEditor";
import { ComponentDivider } from "@/components/editor/ComponentDivider";
import { useState, useEffect } from "react";
import { GenerateSiteButton } from "@/components/GenerateSiteButton";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SiteConfig, generateHtml, newSiteConfig } from "@/lib/site-generator/generate-html";
import { ComponentContainer, ComponentInstance } from "@/lib/components/ComponentContainer";
import { SitePreview } from "@/components/preview/SitePreview";
import { PreviewToggle } from "@/components/preview/PreviewToggle";
import { OpenInNewTab } from "@/components/preview/OpenInNewTab";

export default function Home() {
    const [components, setComponents] = useState<ComponentInstance[]>([]);
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [previewEnabled, setPreviewEnabled] = useState(true);
    const [siteConfig, setSiteConfig] = useState<SiteConfig>(newSiteConfig());

    useEffect(() => {
        const updatedSiteConfig = {
            ...siteConfig,
            components,
        };
        setSiteConfig(updatedSiteConfig);
        
        if (previewEnabled) {
            (async () => {
                const html = await generateHtml(updatedSiteConfig);
                setPreviewHtml(html);
            })();
        }
    }, [components, previewEnabled]);

    const handleDrop = (type: string, index?: number) => {
        const newComponent = ComponentContainer.createInstance(type);
        setComponents(prevComponents => {
            const newComponents = [...prevComponents];
            if (typeof index === 'number') {
                newComponents.splice(index, 0, newComponent);
                return newComponents;
            }
            return [...prevComponents, newComponent];
        });
    };

    const handleComponentUpdate = (updatedComponent: ComponentInstance) => {
        setComponents(components.map(component =>
            component.id === updatedComponent.id ? updatedComponent : component
        ));
    };

    const moveComponent = (dragIndex: number, hoverIndex: number) => {
        setComponents(prevComponents => {
            const newComponents = [...prevComponents];
            const draggedComponent = newComponents[dragIndex];
            newComponents.splice(dragIndex, 1);
            newComponents.splice(hoverIndex, 0, draggedComponent);
            return newComponents;
        });
    };

    const deleteComponent = (id: string) => {
        setComponents(prevComponents =>
            prevComponents.filter(component => component.id !== id)
        );
    };

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
                            <OpenInNewTab siteConfig={siteConfig} />
                            <GenerateSiteButton siteConfig={siteConfig} />
                        </div>
                    </div>
                </div>

                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ResizablePanel defaultSize={previewEnabled ? 50 : 100} minSize={10}>
                        <div className="h-full overflow-y-auto">
                            <div className="p-8">
                                <div className="space-y-4">
                                    {components.length === 0 ? (
                                        <div className="flex items-center justify-center h-full min-h-[400px]">
                                            <ComponentDivider onInsert={(type) => handleDrop(type, 0)} />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {components.map((component, index) => (
                                                <div key={component.id}>
                                                    <ComponentDivider
                                                        onInsert={(type) => handleDrop(type, index)}
                                                    />
                                                    <ComponentEditor
                                                        index={index}
                                                        component={component}
                                                        onUpdate={handleComponentUpdate}
                                                        moveComponent={moveComponent}
                                                        onDrop={handleDrop}
                                                        onDelete={deleteComponent}
                                                    />
                                                    {index === components.length - 1 && (
                                                        <ComponentDivider
                                                            onInsert={(type) => handleDrop(type, index + 1)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    {previewEnabled && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={50} minSize={10}>
                                <SitePreview 
                                    previewHtml={previewHtml} 
                                    siteConfig={siteConfig} 
                                />
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </DndProvider>
    );
}
