"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { PropContentType } from "@/lib/core/props/PropsDescriptor";
import { useState } from "react";
import { PropInputPlugin, PropInputProps } from "../PropInputPluginManager";

function PropInput(
    {
        propsDescriptor,
        prop,
        onChange,
        debounceMillis = 50,
    }: PropInputProps<string>
) {
    // Separate updating the internal text state from triggering an entire 
    // rerender when updating the props of the parent (the entire site props tree).
    // Use debouncing to delay the update of the parent.
    const [inputValue, setInputValue] = useState(prop);
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

const plugin: PropInputPlugin = {
    contentTypes: [PropContentType.TEXT, PropContentType.TEXTAREA, PropContentType.URL],
    jsxFunc: PropInput,
};

export default plugin;
