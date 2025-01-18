import { Component } from '@/lib/newcomps/types';
import { create } from 'zustand';

interface ComponentClipboard {
    copiedComponent: Component | null;
    copy: (component: Component) => void;
    paste: () => Component | null;
    hasCopiedComponent: () => boolean;
}

export const useComponentClipboard = create<ComponentClipboard>(
    (set, get) => ({
            copiedComponent: null,
            copy: (component: Component) => set(() => ({copiedComponent: component})),
            paste: () => {
                const copied = get().copiedComponent 
                return copied ? copied.clone() : null;
            },
            hasCopiedComponent: () => get().copiedComponent !== null,
    })
);

