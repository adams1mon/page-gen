"use client";

import { ComponentDescriptor } from '@/lib/components-meta/ComponentDescriptor';
import { useEditorPreferences } from '@/lib/store/editor-preferences';
import { create } from 'zustand';

interface ComponentSelection {
    selectedComponent: ComponentDescriptor | null;
    isFloating: boolean;
    selectComponent: (comp: ComponentDescriptor) => void;
    closeEditor: () => void;
    switchToFloating: () => void;
    switchToDocked: () => void;
}

export const useComponentSelection = create<ComponentSelection>(
    (set) => {

        const { isFloating, setIsFloating } = useEditorPreferences.getState();

        return {
            selectedComponent: null,
            isFloating: isFloating,
            selectComponent: (comp) => set(() => ({selectedComponent: comp})),
            closeEditor: () => set(() => ({selectedComponent: null})),
            switchToFloating: () => setIsFloating(true),
            switchToDocked: () => setIsFloating(false),
        }
    }
);

