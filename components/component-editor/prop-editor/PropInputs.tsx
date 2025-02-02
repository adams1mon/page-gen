"use client";

import { PropCategory, PropContentType, PropType, PropsDescriptor } from "@/lib/core/props/PropsDescriptor";
import { StringInput } from "./StringInput";
import { NumberInput } from "./NumberInput";
import { ArrayInput } from "./ArrayInput";
import { ObjectInput } from "./ObjectInput";
import { PropInputHeader } from "./PropInputHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Type, Layout, Palette, Zap, Code, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Map categories to their icons and labels
const categoryConfig = {
    [PropCategory.CONTENT]: { icon: <Type className="h-3 w-3" />, label: "Content" },
    [PropCategory.LAYOUT]: { icon: <Layout className="h-3 w-3" />, label: "Layout" },
    [PropCategory.STYLE]: { icon: <Palette className="h-3 w-3" />, label: "Style" },
    [PropCategory.BEHAVIOR]: { icon: <Zap className="h-3 w-3" />, label: "Behavior" },
    [PropCategory.ADVANCED]: { icon: <Code className="h-3 w-3" />, label: "Advanced" },
    [PropCategory.METADATA]: { icon: <FileText className="h-3 w-3" />, label: "Metadata" },
    general: { icon: <Settings className="h-3 w-3" />, label: "General" },
};

export function PropInputs(
    {
        propsDescriptor,
        props,
        onChange,
        keyProp = '',
        breadcrumbsPath = [],
    }: {
        propsDescriptor: PropsDescriptor,
        props: any,
        onChange: (props: any) => void,
        keyProp?: string,
        breadcrumbsPath?: string[],
    }
) {
    // TODO: is this used?
    //if (propsDescriptor.propType == PropType.EMPTY) {
    //    return null;
    //}

    const path = [...breadcrumbsPath, propsDescriptor.displayName];

    // Helper function to create input based on descriptor type
    const createInput = (descriptor: PropsDescriptor, props: any, onChange: (props: any) => void) => {
        console.log("createInput", descriptor.propType);
        
        switch (descriptor.propType) {
            case PropType.LEAF:
                console.log("createInput cont type", descriptor.contentType);
                switch (descriptor.contentType) {
                    case PropContentType.TEXT:
                    case PropContentType.TEXTAREA:
                    case PropContentType.URL:
                        return <StringInput
                            propsDescriptor={descriptor}
                            text={props as string}
                            onChange={onChange}
                            key={keyProp}
                        />

                    case PropContentType.NUMBER:
                        return <NumberInput
                            num={props as number}
                            onChange={onChange}
                            key={keyProp}
                        />

                    default:
                        throw new Error("unknown prop content type" + descriptor.contentType);
                }

            case PropType.ARRAY:
                return <ArrayInput
                    propsDescriptor={descriptor}
                    arr={props as any}
                    onChange={onChange}
                    breadcrumbsPath={path}
                    key={keyProp}
                />

            // this is unused due to the if below
            case PropType.OBJECT:
                return <ObjectInput
                    propsDescriptor={descriptor}
                    obj={props as { [key: string]: any }}
                    onChange={onChange}
                    breadcrumbsPath={path}
                    key={keyProp}
                />

            default:
                console.error(`PropsDescriptor type is undefined or not implemented, displayName: ${descriptor.displayName}, type: ${descriptor.propType}`);
                return null;
        }
    };

    // For object type descriptors, organize props by category
    if (propsDescriptor.propType === PropType.OBJECT) {
        const propsByCategory: Record<string, { key: string; desc: PropsDescriptor }[]> = {};

        // Group props by category
        Object.entries(propsDescriptor.child).forEach(([key, desc]) => {
            const category = desc.category || 'general';
            if (!propsByCategory[category]) {
                propsByCategory[category] = [];
            }
            propsByCategory[category].push({ key, desc });
        });

        const categories = Object.keys(propsByCategory);

        return (
            <div className="w-full space-y-2">
                <PropInputHeader
                    displayName={propsDescriptor.displayName}
                    description={propsDescriptor.desc}
                    breadcrumbsPath={breadcrumbsPath}
                />

                <Tabs defaultValue={categories[0]} className="w-full">
                    <TabsList className="w-full h-8 p-0.5">
                        {categories.map(category => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                className={cn(
                                    "h-7 px-2 text-xs flex items-center gap-1.5",
                                    "data-[state=active]:shadow-none"
                                )}
                            >
                                {categoryConfig[category]?.icon}
                                <span className="truncate">
                                    {categoryConfig[category]?.label}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map(category => (
                        <TabsContent key={category} value={category} className="mt-2 space-y-3">
                            {propsByCategory[category].map(({ key, desc }) => (
                                <div key={key} className="space-y-1.5">
                                    <PropInputs
                                        propsDescriptor={desc}
                                        props={props[key]}
                                        onChange={(newValue) => onChange({
                                            ...props,
                                            [key]: newValue,
                                        })}
                                        keyProp={key}
                                        breadcrumbsPath={path}
                                    />
                                </div>
                            ))}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        );
    }

    // For non-object types, render the input directly
    return (
        <div className="w-full space-y-1.5">
            <PropInputHeader
                displayName={propsDescriptor.displayName}
                description={propsDescriptor.desc}
                breadcrumbsPath={breadcrumbsPath}
            />
            {createInput(propsDescriptor, props, onChange)}
        </div>
    );
}
