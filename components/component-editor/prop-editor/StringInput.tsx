"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { PropContentType, PropsDescriptorLeaf } from "@/lib/core/props/PropsDescriptor";
import { useState } from "react";

export function StringInput(
    {
        propsDescriptor,
        text,
        onChange,
        debounceMillis = 50,
    }: {
        propsDescriptor: PropsDescriptorLeaf,
        text: string,
        onChange: (str: string) => void,
        debounceMillis?: number,
    }
) {
    // Separate updating the internal text state from triggering an entire 
    // rerender when updating the props of the parent (the entire site props tree).
    // Use debouncing to delay the update of the parent.
    const [inputValue, setInputValue] = useState(text);
    const debounce = useDebounce();

    const updateParentDebounced = (text: string) => debounce(() => {
        onChange(text);
    }, debounceMillis);

    const updateInputValue = (e) => {
        setInputValue(e.target.value);
        updateParentDebounced(e.target.value);
    };

    return (
        <>
            {propsDescriptor.contentType == PropContentType.TEXTAREA &&
                <Textarea
                    className="text-sm font-normal"
                    value={inputValue}
                    onChange={updateInputValue}
                    rows={5}
                />
            }

            {propsDescriptor.contentType == PropContentType.TEXT &&
                <Input
                    type="text"
                    value={inputValue}
                    onChange={updateInputValue}
                    className="text-sm font-bold"
                />
            }

            {propsDescriptor.contentType == PropContentType.URL &&
                <Input
                    type="url"
                    value={inputValue}
                    onChange={updateInputValue}
                    className="text-sm font-bold"
                />
            }
        </>
    );
}
