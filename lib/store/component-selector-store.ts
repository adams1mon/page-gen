"use client";

import { ComponentWrapper } from "@/lib/core/ComponentWrapper";
import { create } from "zustand";

interface ComponentSelectorStore {
    isOpen: boolean;
    onInsert?: (component: ComponentWrapper<any>) => void;
    open: (onInsert: (component: ComponentWrapper<any>) => void) => void;
    close: () => void;
}

export const useComponentSelector = create<ComponentSelectorStore>((set) => ({
    isOpen: false,
    onInsert: undefined,
    open: (onInsert) => set({ isOpen: true, onInsert }),
    close: () => set({ isOpen: false, onInsert: undefined }),
}));