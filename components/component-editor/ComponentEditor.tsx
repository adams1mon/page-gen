"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSXEditor } from "./JSXEditor";
import { PropsEditor } from "./PropsEditor";
import { ComponentContainer, ComponentDescriptor, ComponentPropsWithChildren } from "@/lib/components/ComponentContainer";
import { Code2 } from "lucide-react";
import { DataType, EMPTY_DESCRIPTOR } from "@/lib/components/PropsDescriptor";
import { SitePreview } from "../preview/SitePreview";

import { generateHtml, newSite } from "@/lib/site-generator/generate-html";
import { useDebounce } from "@/hooks/use-debounce";

const defaultJsx = `function Component(props) {
  return (
    <div className="w-full py-12 bg-background">
      <div className="max-w-5xl mx-auto px-8">
        {/* Your component JSX here */}
      </div>
    </div>
  );
}`;

export function ComponentEditor() {
    const [component, setComponent] = useState<ComponentDescriptor>({
        id: "ignored",
        type: "CUSTOM",
        name: "CustomHeader",
        icon: <Code2 className="h-4 w-4" />,
        props: {},
        propsDescriptor: EMPTY_DESCRIPTOR,
        customComponent: true,
        jsxFunc: defaultJsx,
    });

    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [site, setSite] = useState<ComponentDescriptor>(newSite());
    const debounce = useDebounce();
    const previewDebounceMillis = 100;

    const debouncePreview = () => debounce(() => {
        (async () => {
            const html = await generateHtml(site);
            setPreviewHtml(html);
        })();
    }, previewDebounceMillis);

    useEffect(debouncePreview, [site]);

    const updateSite = () => {
        setSite({
            ...site,
            props: {
                childrenDesc: [component],
                children: [],
            } as ComponentPropsWithChildren,
        });
    };

    useEffect(updateSite, [component]);

    const handleSave = async () => {
        // TODO: Validate and save component
        console.log("Saving component:", component);

        if (!component.type) {
            alert(`Component type ${component.type} is not defined`);
        } else {
            try {
                ComponentContainer.getDescriptor(component.type);
                ComponentContainer.save(component.type, component);

                console.log(ComponentContainer.getCustomComponents());
                updateSite();

            } catch {
                alert(`Component type ${component.type} already exists`);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Component Type</Label>
                    <Input
                        id="type"
                        value={component.type}
                        onChange={(e) => setComponent({ ...component, type: e.target.value })}
                        placeholder="MyCustomComponent"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                        id="name"
                        value={component.name}
                        onChange={(e) => setComponent({ ...component, name: e.target.value })}
                        placeholder="My Custom Component"
                    />
                </div>

                {
                    //<IconPicker
                    //  value={component.icon}
                    //  onChange={(icon) => setComponent({ ...component, icon })}
                    ///>
                }
            </div>

            <PropsEditor
                value={component.props}
                onChange={(props) => setComponent({ ...component, props })}
            />

            <JSXEditor
                value={component.jsxFunc as string}
                onChange={(jsxFunc) => {
                    setComponent({ ...component, jsxFunc });
                }}
            />

            <SitePreview
                html={previewHtml}
                site={site}
            />

            <Button onClick={handleSave}>Save Component</Button>
        </div>
    );
}
