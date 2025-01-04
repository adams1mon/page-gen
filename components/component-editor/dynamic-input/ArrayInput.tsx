"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrayDesc, createDefaultProps } from "@/lib/components-meta/PropsDescriptor";
import { createInputs } from "./create-inputs";
import { Plus, Trash2 } from "lucide-react";
import { usePropInputContext } from "./PropInputContext";

export function ArrayInput(
    {
        propsDescriptor,
        arr,
        onChange,
    }: {
        propsDescriptor: ArrayDesc,
        arr: any[],
        onChange: (props: any[]) => void,
    },
) {
    const { addToPath } = usePropInputContext();

    return (
        <Card className="w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <div
                    onClick={() => addToPath({
                        displayName: propsDescriptor.displayName,
                    })}
                >
                    <h3 className="text-sm font-medium">{propsDescriptor.displayName}</h3>
                    {propsDescriptor.desc &&
                        <p className="text-sm text-muted-foreground">{propsDescriptor.desc}</p>
                    }
                </div>
                <Button
                    onClick={() => onChange([...arr, createDefaultProps(propsDescriptor.child)])}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </Button>
            </div>

            <div className="space-y-4">
                {arr.map((p: any, i: number) => (
                    <div key={i} className="relative">
                        {createInputs(
                            propsDescriptor.child,
                            p,
                            (partialProps) => onChange([
                                ...arr.slice(0, i),
                                partialProps,
                                ...arr.slice(i + 1)
                            ]),
                            //key + i
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive hover:text-destructive"
                            onClick={() => onChange(arr.filter((_: any, fi: number) => fi !== i))}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
    );
}
