import { useState } from "react";

export function useDebounce(): (func: any, debounceMillis: number) => void {
    const [timeoutObj, setTimeoutObj] = useState<NodeJS.Timeout | null>(null);

    const debounce = (func: any, debounceMillis: number) => {
        if (timeoutObj) {
            // clear timeout on a new function call
            clearTimeout(timeoutObj);
        }

        // set a new timeout
        const id = setTimeout(() => {
            func();

            clearTimeout(id);
            setTimeoutObj(null);
        }, debounceMillis);

        setTimeoutObj(id);
    }

    return debounce
}
