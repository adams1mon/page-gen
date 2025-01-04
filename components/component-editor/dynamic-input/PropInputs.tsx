import { PropsDesc, LeafDesc, ArrayDesc, ObjectDesc, DataType } from "@/lib/components-meta/PropsDescriptor";
import { StringInput } from "./StringInput";
import { NumberInput } from "./NumberInput";
import { ArrayInput } from "./ArrayInput";
import { ObjectInput } from "./ObjectInput";
import { PropInputHeader } from "./PropInputHeader";

export function PropInputs(
    {
        propsDescriptor,
        props,
        onChange,
        key = '',
        breadcrumbsPath = [],
    }: {
        propsDescriptor: PropsDesc,
        props: any,
        onChange: (props: any) => void,
        key?: string,
        breadcrumbsPath?: string[],
    }
) {

    if (propsDescriptor.type == DataType.EMPTY) {
        return null;
    }

    const path = [...breadcrumbsPath, propsDescriptor.displayName];

    const createInput = () => {
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
                    num={props as number}
                    onChange={onChange}
                    key={key}
                />

            case DataType.ARRAY:
                return <ArrayInput
                    propsDescriptor={propsDescriptor as ArrayDesc}
                    arr={props as any}
                    onChange={onChange}
                    breadcrumbsPath={path}
                    key={key}
                />

            case DataType.OBJECT:
                return <ObjectInput
                    propsDescriptor={propsDescriptor as ObjectDesc}
                    obj={props as { [key: string]: any }}
                    onChange={onChange}
                    breadcrumbsPath={path}
                    key={key}
                />

            default:
                console.error(`PropsDesc type is undefined or not implemented, displayName: ${propsDescriptor.displayName}, type: ${propsDescriptor.type}`);
                return null;
        }
    }

    return (
        <div
            className="mt-4"
        >
            <PropInputHeader
                displayName={propsDescriptor.displayName}
                description={propsDescriptor.desc}
                breadcrumbsPath={path}
            />
            {createInput()}
        </div>
    );
}
