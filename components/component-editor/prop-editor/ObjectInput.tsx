import { PropsDescriptorObject } from "@/lib/core/props/PropsDescriptor";
import { PropInputsSlot } from "./PropInputs";

interface strKeyObj {
    [key: string]: any,
};

export function ObjectInput(
    {
        propsDescriptor,
        obj,
        onChange,
        breadcrumbsPath,
    }: {
        propsDescriptor: PropsDescriptorObject,
        obj: strKeyObj,
        onChange: (props: strKeyObj) => void,
        breadcrumbsPath: string[],
    },
) {
    return (
        <div className="w-full">
            <div className="space-y-4">
                {Object.keys(propsDescriptor.child).map(k =>
                    <PropInputsSlot
                        propsDescriptor={propsDescriptor.child[k]}
                        props={obj[k]}
                        onChange={(partialProps) => onChange({
                            ...obj,
                            [k]: partialProps,
                        })}
                        breadcrumbsPath={breadcrumbsPath}

                        // key for React
                        key={k}
                    />
                )}
            </div>
        </div>
    );
}
