"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { PropContentType } from "../PropsDescriptor";
import { PropInputPlugin, PropInputProps } from "../PropInputPluginManager";

function PropInput(
    {
        prop,
        onChange,
        debounceMillis = 100,
    }: PropInputProps<number>
) {
    // Separate updating the internal text state from triggering an entire 
    // rerender when updating the props of the parent (the entire site props tree).
    // Use debouncing to delay the update of the parent.
    const [inputValue, setInputValue] = useState(prop);
    const debounce = useDebounce();

    const updateParentDebounced = (num: number) => debounce(() => {
        onChange(num);
    }, debounceMillis);

    const updateInputValue = (num: number) => {
        setInputValue(num);
        updateParentDebounced(num);
    };

    return (
        <Input
            type="number"
            value={inputValue}
            onChange={(e) => updateInputValue(Number(e.target.value))}
            className="text-sm font-bold"
        />
    );
}

const plugin: PropInputPlugin = {
    contentTypes: [PropContentType.NUMBER],
    jsxFunc: PropInput,
};

export default plugin;
