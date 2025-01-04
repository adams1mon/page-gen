"use client";

import { Card } from "@/components/ui/card";
import { ObjectDesc } from "@/lib/components-meta/PropsDescriptor";
import { createInputs } from "./create-inputs";
import { usePropInputContext } from "./PropInputContext";

interface strKeyObj {
    [key: string]: any,
};

export function ObjectInput(
    {
        propsDescriptor,
        obj,
        onChange,
    }: {
        propsDescriptor: ObjectDesc,
        obj: strKeyObj,
        onChange: (props: strKeyObj) => void,
    },
) {
    const { addToPath } = usePropInputContext();

    return (
        <Card className="w-full p-4">
            <div
                className="mb-4"
                onClick={() => addToPath({
                    displayName: propsDescriptor.displayName,
                })}
            >
                <h3 className="text-sm font-medium">{propsDescriptor.displayName}</h3>
                {propsDescriptor.desc &&
                    <p className="text-sm text-muted-foreground">{propsDescriptor.desc}</p>
                }
            </div>
            <div className="space-y-4">
                {Object.keys(propsDescriptor.child).map(k =>
                    createInputs(
                        propsDescriptor.child[k],
                        obj[k],
                        (partialProps) => onChange({
                            ...obj,
                            [k]: partialProps,
                        }),
                        k,
                    )
                )}
            </div>
        </Card>
    );
}
