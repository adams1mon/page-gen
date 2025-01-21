"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { InputType, LeafDesc } from "@/lib/core/props/PropsDescriptor";
import { useState } from "react";

export function StringInput(
    {
        propsDescriptor,
        text,
        onChange,
        debounceMillis = 50,
    }: {
        propsDescriptor: LeafDesc,
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
            {propsDescriptor.input == InputType.TEXTAREA &&
                <Textarea
                    className="text-sm font-normal"
                    value={inputValue}
                    onChange={updateInputValue}
                    rows={5}
                />
            }

            {propsDescriptor.input == InputType.TEXT &&
                <Input
                    type="text"
                    value={inputValue}
                    onChange={updateInputValue}
                    className="text-sm font-bold"
                />
            }

            {propsDescriptor.input == InputType.URL &&
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
