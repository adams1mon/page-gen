import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputType, LeafDesc } from "@/lib/components-meta/PropsDescriptor";

export function StringInput(
    {
        propsDescriptor,
        text,
        onChange,
    }: {
        propsDescriptor: LeafDesc,
        text: string,
        onChange: (str: string) => void,
    }
) {

    return (
        <>
            {propsDescriptor.input == InputType.TEXTAREA &&
                <Textarea
                    className="text-sm font-normal"
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                />
            }

            {propsDescriptor.input == InputType.TEXT &&
                <Input
                    type="text"
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-sm font-bold"
                />
            }

            {propsDescriptor.input == InputType.URL &&
                <Input
                    type="url"
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-sm font-bold"
                />
            }
        </>
    );
}
