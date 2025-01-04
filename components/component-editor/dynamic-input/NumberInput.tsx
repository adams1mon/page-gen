import { Input } from "@/components/ui/input";
import { LeafDesc } from "@/lib/components-meta/PropsDescriptor";
import { ReactNode } from "react";

export function NumberInput(
    propsDescriptor: LeafDesc,
    num: number, 
    onChange: (num: number) => void, 
        key: string,
): ReactNode {
    return (
        <div key={key} className="mt-4">
            <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
            {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
            <Input
                type="number"
                value={num}
                onChange={(e) => onChange(Number(e.target.value))}
                className="text-sm font-bold"
            />
        </div>
    );
}
