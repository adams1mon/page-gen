// without using setState, only closures 
export function useDebounce(): (func: any, debounceMillis: number) => void {
    let timeoutObj: NodeJS.Timeout | null = null;

    const debounce = (func: any, debounceMillis: number) => {
        if (timeoutObj) {
            // clear timeout on a new function call
            clearTimeout(timeoutObj);
        }

        // set a new timeout
        const id = setTimeout(() => {
            func();

            clearTimeout(id);
            timeoutObj = null;
        }, debounceMillis);
        
        timeoutObj = id;
    }

    return debounce
}

