import { ComponentWrapper } from '@/lib/newcomps/types';
import { create } from 'zustand';

interface ComponentClipboard {
    copiedComponent: ComponentWrapper | null;
    copy: (component: ComponentWrapper) => void;
    paste: () => ComponentWrapper | null;
    hasCopiedComponent: () => boolean;
}

export const useComponentClipboard = create<ComponentClipboard>(
    (set, get) => ({
            copiedComponent: null,
            copy: (component: ComponentWrapper) => set(() => ({copiedComponent: component})),
            paste: () => {
                const copied = get().copiedComponent 
                return copied ? copied.clone() : null;
            },
            hasCopiedComponent: () => get().copiedComponent !== null,
    })
);

