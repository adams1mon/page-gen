import { ComponentDescriptor } from '@/lib/components-meta/ComponentDescriptor';
import { Component } from '@/lib/newcomps/Heading';
import { Page } from '@/lib/newcomps/Page';
import { create } from 'zustand';

//interface ComponentSelection {
//    selectedComponent: ComponentDescriptor | null;
//    selectComponent: (comp: ComponentDescriptor) => void;
//    closeEditor: () => void;
//}
//
//export const useComponentSelection = create<ComponentSelection>(
//    (set) => {
//        return {
//            selectedComponent: null,
//            selectComponent: (comp) => set(() => ({selectedComponent: comp})),
//            closeEditor: () => set(() => ({selectedComponent: null})),
//        }
//    }
//);

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


