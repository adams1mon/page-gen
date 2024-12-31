import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { PropsDesc, LeafDesc, ArrayDesc, ObjectDesc, createDefaultProps, DataType, InputType } from "@/lib/components/PropDescriptor";


export function createInputs(
    propsDescriptor: PropsDesc,
    props: any,
    onChange: (props: any) => void,
    key: string = '',
): ReactNode {

    switch (propsDescriptor.type) {
        case DataType.STRING:
            return stringInput(propsDescriptor as LeafDesc, props, onChange, key);

        case DataType.NUMBER:
            return numberInput(propsDescriptor as LeafDesc, props, onChange, key);

        case DataType.ARRAY:
            return arrayInput(propsDescriptor as ArrayDesc, props, onChange, key);

        case DataType.OBJECT:
            return objectInput(propsDescriptor as ObjectDesc, props, onChange, key);

        default:
            console.error(`PropsDesc type is undefined or not implemented, displayName: ${propsDescriptor.displayName}, type: ${propsDescriptor.type}. Ensure every descriptor has a 'type' and a 'displayName' attribute.`);
    }
}

function stringInput(propsDescriptor: LeafDesc, props: any, onChange: (props: any) => void, key: string): ReactNode {
    return <div
        key={key}
        className="mt-4"
    >
        <label className="text-sm font-medium py-1">{propsDescriptor.displayName}</label>
        {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
        {propsDescriptor.input == InputType.TEXTAREA &&
            <Textarea
                className="text-sm font-normal"
                value={props}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
            />
        }

        {propsDescriptor.input == InputType.TEXT &&
            <Input
                type="text"
                value={props}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm font-bold"
            />
        }

        {propsDescriptor.input == InputType.URL &&
            <Input
                type="url"
                value={props}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm font-bold"
            />
        }
    </div>
}

function numberInput(propsDescriptor: LeafDesc, props: any, onChange: (props: any) => void, key: string): ReactNode {
    return (
        <div key={key} className="mt-4">
            <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
            {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
            <Input
                type="number"
                value={props}
                onChange={(e) => onChange(Number(e.target.value))}
                className="text-sm font-bold"
            />
        </div>
    );
}

function arrayInput(propsDescriptor: ArrayDesc, props: any[], onChange: (props: any) => void, key: string): ReactNode {
    return (
        <Card key={key} className="w-full mt-4 p-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
                {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
                <Button
                    onClick={() => onChange([...props, ...createDefaultProps(propsDescriptor)])}
                    variant="outline"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            </div>

            {props.map((p: any, i: number) => (
                <div key={key + i}>
                    {createInputs(
                        propsDescriptor.child,
                        p,
                        (partialProps) => onChange([...props.slice(0, i), partialProps, ...props.slice(i + 1)]),
                        key + " " + (i + 1)
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onChange(props.filter((_: any, fi: number) => fi !== i))}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </Card>
    );
}


function objectInput(propsDescriptor: ObjectDesc, props: any, onChange: (props: any) => void, key: string): ReactNode {
    return (
        <Card key={key} className="w-full mt-4 p-2">
            <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
            {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
            {Object.keys(props).map(k =>
                createInputs(
                    propsDescriptor.child[k],
                    props[k],
                    (partialProps) => onChange({
                        ...props,
                        [k]: partialProps,
                    }),
                    k
                )
            )}
        </Card>
    );
}
