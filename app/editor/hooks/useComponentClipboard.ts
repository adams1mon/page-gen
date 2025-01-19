import { ComponentWrapper } from '@/lib/core/ComponentWrapper';
import { create } from 'zustand';

interface ComponentClipboard<T> {
    copiedComponent: ComponentWrapper<T> | null;
    copy: (component: ComponentWrapper<T>) => void;
    paste: () => ComponentWrapper<T> | null;
    hasCopiedComponent: () => boolean;
}

export const useComponentClipboard = create<ComponentClipboard<any>>(
    (set, get) => ({
            copiedComponent: null,
            copy: (component: ComponentWrapper<any>) => set(() => ({copiedComponent: component})),
            paste: () => {
                const copied = get().copiedComponent 
                return copied ? copied.clone() : null;
            },
            hasCopiedComponent: () => get().copiedComponent !== null,
    })
);

