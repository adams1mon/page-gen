import { ComponentNode } from '@/lib/core/ComponentWrapper';
import { create } from 'zustand';

interface ComponentClipboard<T> {
    copiedComponent: ComponentNode<T> | null;
    copy: (component: ComponentNode<T>) => void;
    paste: () => ComponentNode<T> | null;
    hasCopiedComponent: () => boolean;
}

export const useComponentClipboard = create<ComponentClipboard<any>>(
    (set, get) => ({
            copiedComponent: null,
            copy: (component: ComponentNode<any>) => set(() => ({copiedComponent: component})),
            paste: () => {
                const copied = get().copiedComponent 
                return copied ? copied.clone() : null;
            },
            hasCopiedComponent: () => get().copiedComponent !== null,
    })
);

