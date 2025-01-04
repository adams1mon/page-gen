import { Card } from "@/components/ui/card";
import { ObjectDesc } from "@/lib/components/PropsDescriptor";
import { ReactNode } from "react";
import { createInputs } from "./create-inputs";

interface strKeyObj {
    [key: string]: any,
};

export function ObjectInput(
    propsDescriptor: ObjectDesc,
    props: strKeyObj,
    onChange: (props: strKeyObj) => void,
    key: string,
): ReactNode {

    return (
        <Card key={key} className="w-full mt-4 p-2">
            <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
            {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
            {
                Object.keys(propsDescriptor.child).map(k =>
                    createInputs(
                        propsDescriptor.child[k],
                        props[k],
                        (partialProps) => onChange({
                            ...props,
                            [k]: partialProps,
                        }),
                        k
                    )
                )
            }
        </Card>
    );
}
