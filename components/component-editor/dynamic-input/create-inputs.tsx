import { ReactNode } from "react";
import { PropsDesc, LeafDesc, ArrayDesc, ObjectDesc, DataType } from "@/lib/components/PropsDescriptor";
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
            return StringInput(
                propsDescriptor as LeafDesc,
                props as string,
                onChange,
                key,
            );

        case DataType.NUMBER:
            return NumberInput(
                propsDescriptor as LeafDesc,
                props as number,
                onChange,
                key,
            );

        case DataType.ARRAY:
            return ArrayInput(
                propsDescriptor as ArrayDesc,
                props as any,
                onChange,
                key,
            );

        case DataType.OBJECT:
            return ObjectInput(
                propsDescriptor as ObjectDesc,
                props as {[key: string]: any},
                onChange,
                key,
            );

        case DataType.EMPTY:
            return null;

        default:
            console.error(`PropsDesc type is undefined or not implemented, displayName: ${propsDescriptor.displayName}, type: ${propsDescriptor.type}. Ensure every descriptor has a 'type' and a 'displayName' attribute.`);
    }
}

