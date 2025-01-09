import { ObjectDesc } from "@/lib/components-meta/PropsDescriptor";
import { PropInputs } from "./PropInputs";

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
        propsDescriptor: ObjectDesc,
        obj: strKeyObj,
        onChange: (props: strKeyObj) => void,
        breadcrumbsPath: string[],
    },
) {
    return (
        <div className="w-full">
            <div className="space-y-4">
                {Object.keys(propsDescriptor.child).map(k =>
                    <PropInputs
                        propsDescriptor={propsDescriptor.child[k]}
                        props={obj[k]}
                        onChange={(partialProps) => onChange({
                            ...obj,
                            [k]: partialProps,
                        })}
                        breadcrumbsPath={breadcrumbsPath}

                        // key for the child components
                        keyProp={k}

                        // key for React
                        key={k}
                    />
                )}
            </div>
        </div>
    );
}
