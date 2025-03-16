import { ComponentNode } from '@/lib/core/ComponentWrapper';
import { Page } from '@/lib/core/page/Page';
import { create } from 'zustand';

interface ComponentSelection {
    selectedComponent: Page | ComponentNode | null;
    selectComponent: (comp: Page | ComponentNode) => void;
    closeEditor: () => void;
}

export const useComponentSelection = create<ComponentSelection>(
    (set) => {
        return {
            selectedComponent: null,
            selectComponent: (comp) => set(() => ({selectedComponent: comp})),
            closeEditor: () => set(() => ({selectedComponent: null})),
        }
    }
);


