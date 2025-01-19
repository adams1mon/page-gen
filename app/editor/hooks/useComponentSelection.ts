import { Page } from '@/lib/newcomps/Page';
import { ComponentWrapper } from '@/lib/newcomps/types';
import { create } from 'zustand';

interface ComponentSelection {
    selectedComponent: Page | ComponentWrapper | null;
    selectComponent: (comp: Page | ComponentWrapper) => void;
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


