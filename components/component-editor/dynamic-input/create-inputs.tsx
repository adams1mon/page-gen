import { ReactNode } from "react";
import { PropsDesc, LeafDesc, ArrayDesc, ObjectDesc, DataType } from "@/lib/components-meta/PropsDescriptor";
import { StringInput } from "./StringInput";
import { NumberInput } from "./NumberInput";
import { ArrayInput } from "./ArrayInput";
import { ObjectInput } from "./ObjectInput";

export function createInputs(
    propsDescriptor: PropsDesc,
    props: any,
    onChange: (props: any) => void,
    key: string = '',
): ReactNode {
    switch (propsDescriptor.type) {
        case DataType.STRING:
            return <StringInput
                propsDescriptor={propsDescriptor as LeafDesc}
                text={props as string}
                onChange={onChange}
                key={key}
            />

        case DataType.NUMBER:
            return <NumberInput
                propsDescriptor={propsDescriptor as LeafDesc}
                num={props as number}
                onChange={onChange}
                key={key}
            />

        case DataType.ARRAY:
            return <ArrayInput
                propsDescriptor={propsDescriptor as ArrayDesc}
                arr={props as any}
                onChange={onChange}
                key={key}
            />

        case DataType.OBJECT:
            return <ObjectInput
                propsDescriptor={propsDescriptor as ObjectDesc}
                obj={props as { [key: string]: any }}
                onChange={onChange}
                key={key}
            />

        case DataType.EMPTY:
            return null;

        default:
            console.error(`PropsDesc type is undefined or not implemented, displayName: ${propsDescriptor.displayName}, type: ${propsDescriptor.type}`);
            return null;
    }
}
