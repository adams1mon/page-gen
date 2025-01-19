import { ComponentWrapper } from '@/lib/core/ComponentWrapper';
import { Page } from '@/lib/core/page/Page';
import { create } from 'zustand';

interface ComponentSelection<T> {
    selectedComponent: Page | ComponentWrapper<T> | null;
    selectComponent: (comp: Page | ComponentWrapper<T>) => void;
    closeEditor: () => void;
}

export const useComponentSelection = create<ComponentSelection<any>>(
    (set) => {
        return {
            selectedComponent: null,
            selectComponent: (comp) => set(() => ({selectedComponent: comp})),
            closeEditor: () => set(() => ({selectedComponent: null})),
        }
    }
);


