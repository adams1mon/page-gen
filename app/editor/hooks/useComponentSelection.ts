import { ComponentDescriptor } from '@/lib/components-meta/ComponentDescriptor';
import { Component } from '@/lib/newcomps/Heading';
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
    selectedComponent: Component | null;
    selectComponent: (comp: Component) => void;
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


