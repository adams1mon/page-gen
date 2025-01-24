"use client";

import { create } from 'zustand';
import { PageRepository } from '../core/PageRepository';
import { Page, SerializedPage } from '../core/page/Page';
import { EventDispatcher } from '../core/EventDispatcher';

// the chain should work like this:
// 1. load a LoadedState into SiteStore
// 2. modify state of the SiteStore
// 3. when saving, grab only the saveable attributes from SiteStore, SaveableState

interface SiteStore {
    // Site state
    site: Page;
    pageName: string;
    autoSave: boolean;
    savedPages: { [key: string]: SerializedPage };

    // Actions
    setSite: (site: Page) => void;
    setAutoSave: (enabled: boolean) => void;
    saveSite: (name?: string) => void;
    loadSite: (name: string) => void;
    resetSite: () => void;
    deleteSavedSite: (name: string) => void;
}

// state from local storage,
// part of sitestore that is saved
interface SaveableState { 
    pageName: string;
    autoSave: boolean;
    savedPages: {
        [key: string]: SerializedPage;
    };
};

const storageKey = "page-storage";

function saveState(state: SaveableState) {
    console.log("save state to local storage");
    localStorage.setItem(storageKey, JSON.stringify(state));
}

// only returns some properties of the site store, no functions

type LoadedState = SaveableState & { site: Page };
function loadState(): LoadedState {

    // load from the store
    const stateJson = localStorage.getItem(storageKey);

    let parsed: Partial<SaveableState> = {};
    if (stateJson) {
        parsed = JSON.parse(stateJson);
    }

    // check if the site with the given name exists 
    let loadedPage;
    if (!parsed.pageName || !parsed.savedPages || !(parsed.pageName in parsed.savedPages)) {
        console.log("site ", parsed.pageName, " not found in ", parsed.savedPages);
        loadedPage = PageRepository.createPage();
    } else {
        loadedPage = PageRepository.deserialize(parsed.savedPages[parsed.pageName]);
    }

    EventDispatcher.publish("load", {page: loadedPage});

    return {
        site: loadedPage,
        pageName: parsed.pageName,
        autoSave: parsed.autoSave || true,
        savedPages: parsed.savedPages || {},
    } as LoadedState;
}

export const useSiteStore = create<SiteStore>()(
    (set, get) => {

        const loaded = loadState();

        return {
            site: loaded.site,
            pageName: loaded.pageName,
            autoSave: loaded.autoSave,
            savedPages: loaded.savedPages,

            setSite: (site) => {
                set({ site });
                if (get().autoSave) {
                    get().saveSite();
                }
            },

            setAutoSave: (enabled) => set(state => {
                console.log("set autosave");

                return { autoSave: enabled }
            }),

            saveSite: (name = 'default') => {
                set((state) => {

                    const serializedPage = PageRepository.serialize(state.site);

                    const newState: Partial<SiteStore> = {
                        pageName: name,
                        savedPages: {
                            ...state.savedPages,
                            [name]: serializedPage,
                        },
                    }

                    saveState({
                        pageName: name,
                        savedPages: newState.savedPages!,
                        autoSave: state.autoSave,
                    });

                    return newState;
                });
            },

            loadSite: (name) => {

                console.log("load site");

                // the saved sites are already in memory, they just need to be created
                const { savedPages: savedSites } = get();
                console.log(savedSites);

                if (savedSites[name]) {
                    const loaded = PageRepository.deserialize(savedSites[name]);
                    console.log("load site called", loaded);

                    set({
                        site: loaded,
                    });
                }
            },

            resetSite: () => set({ site: PageRepository.createPage() }),

            deleteSavedSite: (name) => {
                set((state) => {
                    const { [name]: _, ...rest } = state.savedPages;
                    return { savedPages: rest };
                });
            }
        }
    },
);

