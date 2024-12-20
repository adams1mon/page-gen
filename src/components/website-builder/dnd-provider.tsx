"use client";

import { ReactNode, useEffect, useState } from "react";

interface DndProviderProps {
    children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <>{children}</>;
}
