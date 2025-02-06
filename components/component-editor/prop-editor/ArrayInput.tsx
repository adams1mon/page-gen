import { Button } from "@/components/ui/button";
import { PropsDescriptorArray, createDefaultProps } from "@/lib/core/props/PropsDescriptor";
import { PropInputsSlot } from "./PropInputs";
import { Plus, Trash2 } from "lucide-react";

export function ArrayInput(
    {
        propsDescriptor,
        arr,
        onChange,
        breadcrumbsPath,
    }: {
        propsDescriptor: PropsDescriptorArray,
        arr: any[],
        onChange: (props: any[]) => void,
        breadcrumbsPath: string[],
    },
) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <Button
                    onClick={() => onChange([...arr, createDefaultProps(propsDescriptor)])}
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
                        <PropInputsSlot
                            propsDescriptor={propsDescriptor.child}
                            props={p}
                            onChange={(partialProps) => onChange([
                                ...arr.slice(0, i),
                                partialProps,
                                ...arr.slice(i + 1)
                            ])}
                            breadcrumbsPath={breadcrumbsPath}
                        />
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
        </div>
    );
}
