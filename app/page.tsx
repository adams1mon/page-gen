"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PortfolioComponent } from "@/components/portfolio/PortfolioComponent";
import { ComponentDivider } from "@/components/portfolio/ComponentDivider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GenerateSiteButton } from "@/components/GenerateSiteButton";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ComponentConfig, createComponentConfig } from "@/lib/components/Component";
import { SiteConfig, generateHtml } from "@/lib/site-generator/generate-html";
import { ComponentContainer } from "@/lib/components/ComponentContainer";

export default function Home() {
    const [components, setComponents] = useState<ComponentConfig[]>([]);
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [siteConfig, setSiteConfig] = useState<SiteConfig>({
        title: 'My Portfolio',
        description: 'Welcome to my portfolio website',
        components
    });

    // Update site config and preview whenever components change
    useEffect(() => {
        const newSiteConfig = {
            ...siteConfig,
            components,
        };
        setSiteConfig(newSiteConfig);
        const html = generateHtml(newSiteConfig);
        setPreviewHtml(html);
    }, [components]);

    const handleDrop = (type: string, index?: number) => {
        //const newComponent = createComponentConfig(type);
        const newComponent = ComponentContainer.createComponentConfig(type);

        setComponents(prevComponents => {
            const newComponents = [...prevComponents];
            if (typeof index === 'number') {
                newComponents.splice(index, 0, newComponent);
                return newComponents;
            }
            return [...prevComponents, newComponent];
        });
    };

    const handleComponentUpdate = (updatedComponent: ComponentConfig) => {
        console.log(updatedComponent);
        
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
                {/* Header */}
                <div className="border-b bg-background">
                    <div className="flex justify-between items-center p-4">
                        <h1 className="text-2xl font-bold">Portfolio Builder</h1>
                        <div className="flex items-center gap-4">
                            <Link href="/catalog">
                                <Button variant="outline" className="gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Component Catalog
                                </Button>
                            </Link>
                            <GenerateSiteButton siteConfig={siteConfig} />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <ResizablePanelGroup
                    direction="horizontal"
                    className="flex-1"
                >
                    {/* Editor Panel */}
                    <ResizablePanel defaultSize={50} minSize={10}>
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
                                                    <PortfolioComponent
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

                    {/* Resize Handle */}
                    <ResizableHandle withHandle />

                    {/* Preview Panel */}
                    <ResizablePanel defaultSize={50} minSize={10}>
                        <div className="h-full bg-gray-50">
                            
                            {/* TODO: use a shadow DOM element here */}
                            <iframe
                                srcDoc={previewHtml}
                                className="w-full h-full border-0"
                                title={siteConfig.title}
                                sandbox="allow-same-origin"
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </DndProvider>
    );
}
