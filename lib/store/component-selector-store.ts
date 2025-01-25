"use client";

import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { create } from "zustand";

interface ComponentSelectorStore {
    isOpen: boolean;
    onInsert?: (component: ComponentNode<any>) => void;
    openComponentSelector: (onInsert: (component: ComponentNode<any>) => void) => void;
    close: () => void;
}

export const useComponentSelector = create<ComponentSelectorStore>((set) => ({
    isOpen: false,
    onInsert: undefined,
    openComponentSelector: (onInsert) => set({ isOpen: true, onInsert }),
    close: () => set({ isOpen: false, onInsert: undefined }),
}));
