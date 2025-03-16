import { ComponentNode } from '@/lib/core/ComponentWrapper';
import { create } from 'zustand';

interface ComponentClipboard {
    copiedComponent: ComponentNode | null;
    copy: (component: ComponentNode) => void;
    paste: () => ComponentNode | null;
    hasCopiedComponent: () => boolean;
}

export const useComponentClipboard = create<ComponentClipboard>(
    (set, get) => ({
            copiedComponent: null,
            copy: (component: ComponentNode) => set(() => ({copiedComponent: component})),
            paste: () => {
                const copied = get().copiedComponent 
                return copied ? copied.clone() : null;
            },
            hasCopiedComponent: () => get().copiedComponent !== null,
    })
);

