"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentDescriptor } from '../components-meta/ComponentDescriptor';
import { newSite } from '../site-generator/generate-html';
import { LogIn } from 'lucide-react';
import { removeChildrenProps } from '../components-meta/ComponentContainer';

interface SiteStore {
    // Site state
    site: ComponentDescriptor;
    autoSave: boolean;
    savedSites: { [key: string]: ComponentDescriptor };
    lastSaved: string | null;

    // Actions
    setSite: (site: ComponentDescriptor) => void;
    setAutoSave: (enabled: boolean) => void;
    saveSite: (name?: string) => void;
    loadSite: (name: string) => void;
    resetSite: () => void;
    deleteSavedSite: (name: string) => void;
}

export const useSiteStore = create<SiteStore>()(
    persist(
        (set, get) => ({
            site: newSite(),
            autoSave: true,
            savedSites: {},
            lastSaved: null,

            setSite: (site) => {
                set({ site });
                if (get().autoSave) {
                    get().saveSite();
                }
            },

            setAutoSave: (enabled) => set({ autoSave: enabled }),

            saveSite: (name = 'default') => {

                const timestamp = new Date().toISOString();
                set((state) => ({
                    savedSites: {
                        ...state.savedSites,
                        [name]: state.site,
                    },
                    lastSaved: timestamp,
                }));
            },

            loadSite: (name) => {
                const { savedSites } = get();
                if (savedSites[name]) {
                    set({ site: savedSites[name] });
                }
            },

            resetSite: () => set({ site: newSite() }),

            deleteSavedSite: (name) => {
                set((state) => {
                    const { [name]: _, ...rest } = state.savedSites;
                    return { savedSites: rest };
                });
            }
        }),
        {
            name: 'site-storage',
            partialize: (state) => {
                // Pick the state that we want to save, remove the 'children' prop.
                // Anything should be removed that are is serializable to JSON.
                const site = removeChildrenProps(state.site);

                return {
                    site: site,
                    autoSave: state.autoSave,
                    savedSites: state.savedSites,
                }
            },
        }
    )
);

