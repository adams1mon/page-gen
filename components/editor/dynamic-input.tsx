import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

function capitalizeFirstChar(s: string): string {
    if (s.length <= 0) return "";
    return s[0].toUpperCase() + s.slice(1);
}

// TODO: proper types
// creates inputs forms based on the 'props' a component has
export function createInputs(props: any, onChange: (props: any) => void, key: string = ''): ReactNode {
    if (typeof props === "string") {
        return <div
            key={key}
            className="mt-4"
        >
            {key.length > 0 && (
                <label className="text-sm font-medium py-1">{capitalizeFirstChar(key)}</label>
            )}
            {props.length > 40 ? (
                <Textarea
                    className="text-sm font-normal"
                    value={props}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                />
            ) : (
                <Input
                    value={props}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-sm font-bold"
                />
            )}
        </div>
    }

    if (Array.isArray(props)) {
        return (
            <Card key={key} className="w-full mt-4 p-2">
                <div className="flex items-center justify-between">
                    {key.length > 0 && (
                        <label className="text-sm font-medium">{capitalizeFirstChar(key)}</label>
                    )}
                    <Button
                        onClick={() => onChange([...props, props[props.length - 1]])}
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
                            p,
                            (partialProps) => onChange([...props.slice(0, i), partialProps, ...props.slice(i + 1)]),
                            key + " " + (i+1)
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onChange(props.filter((_, fi: number) => fi !== i))}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </Card>
        );
    }

    if (typeof props === "number") {
        return (
            <div key={key} className="mt-4">
                {key.length > 0 && (
                    <label className="text-sm font-medium">{capitalizeFirstChar(key)}</label>
                )}
                <Input
                    value={props}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="text-sm font-bold"
                />
            </div>
        );
    }

    if (typeof props === "object") {
        return (
            <Card key={key} className="w-full mt-4 p-2">
                {key.length > 0 && (
                    <label className="text-sm font-medium">{capitalizeFirstChar(key)}</label>
                )}
                {Object.keys(props).map(k =>
                    createInputs(
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
}
