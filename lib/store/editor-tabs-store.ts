"use client";

import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { Page } from "@/lib/core/page/Page";
import { create } from "zustand";

export interface EditorTab {
    id: string,
    component: ComponentNode | Page;
};

interface EditorTabsStore {
    tabs: Record<string, EditorTab>;
    addTab: (component: ComponentNode | Page) => void;
    removeTab: (id: string) => void;
}

export const useEditorTabs = create<EditorTabsStore>((set) => ({
    tabs: {},

    addTab: (component) => set((state) => {
        const tabId = component.id;

        // Check if tab already exists for this component
        if (tabId in state.tabs) {
            const existingTab = state.tabs[tabId];
            return {
                ...state,
                tabs: {
                    ...state.tabs,
                    [tabId]: existingTab,
                }
            };
        }

        return {
            tabs: { 
                ...state.tabs, 
                [tabId]: {
                    // just use the component id
                    id: component.id,
                    component,
                },
            },
        };
    }),

    removeTab: (id) => set((state) => {
        const { [id]: removedTab, ...remainingTabs } = state.tabs;
        return {
            tabs: remainingTabs,
        };
    }),
}));
