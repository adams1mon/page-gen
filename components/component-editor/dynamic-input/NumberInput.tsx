import { Input } from "@/components/ui/input";
import { LeafDesc } from "@/lib/components-meta/PropsDescriptor";

export function NumberInput(
    {
        propsDescriptor,
        num,
        onChange,
    }: {
        propsDescriptor: LeafDesc,
        num: number,
        onChange: (num: number) => void,
    },
) {
    return (
        <div className="mt-4">
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
