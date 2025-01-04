import { Input } from "@/components/ui/input";

export function NumberInput(
    {
        num,
        onChange,
    }: {
        num: number,
        onChange: (num: number) => void,
    },
) {
    return (
        <Input
            type="number"
            value={num}
            onChange={(e) => onChange(Number(e.target.value))}
            className="text-sm font-bold"
        />
    );
}
