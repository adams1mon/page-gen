import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrayDesc, createDefaultProps } from "@/lib/components-meta/PropsDescriptor";
import { ReactNode } from "react";
import { createInputs } from "./create-inputs";
import { Plus, Trash2 } from "lucide-react";

export function ArrayInput(
    propsDescriptor: ArrayDesc,
    props: any[],
    onChange: (props: any[]) => void,
    key: string,
): ReactNode {
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

            {
                props.map((p: any, i: number) => (
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
                ))
            }
        </Card>
    );
}
