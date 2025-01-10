"use client";

import { PropsDesc, LeafDesc, ArrayDesc, ObjectDesc, DataType } from "@/lib/components-meta/PropsDescriptor";
import { StringInput } from "./StringInput";
import { NumberInput } from "./NumberInput";
import { ArrayInput } from "./ArrayInput";
import { ObjectInput } from "./ObjectInput";
import { PropInputHeader } from "./PropInputHeader";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropInputs(
    {
        propsDescriptor,
        props,
        onChange,

        // the 'key' prop can't be passed as a prop, so use a different name for it
        keyProp = '',

        breadcrumbsPath = [],
    }: {
        propsDescriptor: PropsDesc,
        props: any,
        onChange: (props: any) => void,
        keyProp?: string,
        breadcrumbsPath?: string[],
    }
) {
    if (propsDescriptor.type == DataType.EMPTY) {
        return null;
    }

    const [isOpen, setIsOpen] = useState(true);
    const path = [...breadcrumbsPath, propsDescriptor.displayName];

    const createInput = () => {
        switch (propsDescriptor.type) {
            case DataType.STRING:
                return <StringInput
                    propsDescriptor={propsDescriptor as LeafDesc}
                    text={props as string}
                    onChange={onChange}
                    key={keyProp}
                />

            case DataType.NUMBER:
                return <NumberInput
                    num={props as number}
                    onChange={onChange}
                    key={keyProp}
                />

            case DataType.ARRAY:
                return <ArrayInput
                    propsDescriptor={propsDescriptor as ArrayDesc}
                    arr={props as any}
                    onChange={onChange}
                    breadcrumbsPath={path}
                    key={keyProp}
                />

            case DataType.OBJECT:
                return <ObjectInput
                    propsDescriptor={propsDescriptor as ObjectDesc}
                    obj={props as { [key: string]: any }}
                    onChange={onChange}
                    breadcrumbsPath={path}
                    key={keyProp}
                />

            default:
                console.error(`PropsDesc type is undefined or not implemented, displayName: ${propsDescriptor.displayName}, type: ${propsDescriptor.type}`);
                return null;
        }
    }

    return (
        <div
            className="mt-2 z-50"
            onClick={(e) => e.stopPropagation()}
        >
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between border-b cursor-pointer">
                        <PropInputHeader
                            displayName={propsDescriptor.displayName}
                            description={propsDescriptor.desc}
                            breadcrumbsPath={path}
                        />
                        <Button variant="ghost" size="icon">
                            <ChevronDown className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isOpen ? "rotate-180" : ""
                            )} />
                        </Button>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    {createInput()}
                </CollapsibleContent>
            </Collapsible>
        </div >
    );
}
