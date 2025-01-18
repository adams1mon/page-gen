import { Page } from '@/lib/newcomps/Page';
import { Component } from '@/lib/newcomps/types';
import { create } from 'zustand';

interface ComponentSelection {
    selectedComponent: Page | Component | null;
    selectComponent: (comp: Page | Component) => void;
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


