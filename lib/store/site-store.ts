"use client";

import { create } from 'zustand';
import { PageRepository } from '../core/PageRepository';
import { Page, SerializedPage } from '../core/page/Page';
import { StateCreator } from 'zustand';

// the chain should work like this:
// 1. load a LoadedState into SiteStore
// 2. modify state of the SiteStore
// 3. when saving, grab only the saveable attributes from SiteStore, SaveableState

interface SiteStore {
    // Site state
    site: Page;
    currentPage: string;
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
    currentPage: string;
    autoSave: boolean;
    savedPages: {
        [key: string]: SerializedPage;
    };
};

const storageKey = "page-storage";

function saveState(state: SaveableState) {
    if (typeof window === 'undefined') return;
    console.log("save state to local storage", state);
    localStorage.setItem(storageKey, JSON.stringify(state));
}

// this should always return sensible defaults, even if there is no saved page
type LoadedState = SaveableState & { site: Page };
function loadStateOrDefault(): LoadedState {
    if (typeof window === 'undefined') {
        return {
            site: defaultPage(),
            currentPage: defaultPageName(),
            autoSave: true,
            savedPages: {},
        };
    }

    // load from the store
    const stateJson = localStorage.getItem(storageKey);

    let parsed: Partial<SaveableState> = {};
    if (stateJson) {
        parsed = JSON.parse(stateJson);
    }

    // check if the site with the given name exists 
    let loadedPage;
    if (!parsed.currentPage || !parsed.savedPages || !(parsed.currentPage in parsed.savedPages)) {
        console.log("site ", parsed.currentPage, " not found in ", parsed.savedPages, "creating new page");
        loadedPage = defaultPage();
    } else {
        loadedPage = PageRepository.load(parsed.savedPages[parsed.currentPage]);
    }

    return {
        site: loadedPage,
        currentPage: parsed.currentPage || defaultPageName(),
        autoSave: parsed.autoSave || true,
        savedPages: parsed.savedPages || {},
    } as LoadedState;
}

function defaultPageName(): string {
    return `page-${Math.floor(Date.now() / 1000)}`
}

function defaultPage(): Page {
    return PageRepository.createPage();
}

const defaultStoreState: SiteStore = {
    site: defaultPage(),
    currentPage: '',
    autoSave: true,
    savedPages: {},
    setSite: () => {},
    setAutoSave: () => {},
    saveSite: () => {},
    loadSite: () => {},
    resetSite: () => {},
    deleteSavedSite: () => {},
};

const createStore: StateCreator<SiteStore> = (set, get, store) => {
    const prevState = get();
    const loaded = loadStateOrDefault();

    return {
        site: prevState?.site || loaded.site,
        currentPage: prevState?.currentPage || loaded.currentPage,
        autoSave: prevState?.autoSave || loaded.autoSave,
        savedPages: prevState?.savedPages || loaded.savedPages,

        setSite: (site) => {
            set({ site });
            console.log("setting site", site);

            if (get().autoSave) {
                get().saveSite();
            }
        },

        setAutoSave: (enabled) => set(() => {
            return { autoSave: enabled }
        }),

        saveSite: (name?) => {
            set((state) => {
                const serializedPage = PageRepository.serialize(get().site);
                name = name || state.currentPage;

                const newState: Partial<SiteStore> = {
                    currentPage: name,
                    savedPages: {
                        ...state.savedPages,
                        [name]: serializedPage,
                    }
                }

                saveState({
                    currentPage: newState.currentPage!,
                    savedPages: newState.savedPages!,
                    autoSave: state.autoSave,
                });

                return newState;
            });
        },

        loadSite: (name) => {
            const { savedPages } = get();
            console.log(savedPages);

            if (savedPages[name]) {
                const loaded = PageRepository.load(savedPages[name]);

                set({
                    site: loaded,
                    currentPage: name,
                });
            }
        },

        resetSite: () => set({ site: PageRepository.createPage() }),

        deleteSavedSite: (name) => {
            set((state) => {
                const { [name]: _, ...rest } = state.savedPages;

                const newState: Partial<SiteStore> = {
                    currentPage: state.currentPage,
                    savedPages: rest,
                }

                if (name === state.currentPage) {
                    newState.currentPage = defaultPageName();
                    newState.site = defaultPage();
                }

                saveState({
                    currentPage: newState.currentPage!,
                    savedPages: newState.savedPages!,
                    autoSave: state.autoSave,
                });

                return { savedPages: rest };
            });
        }
    }
};

// Export a dynamic version of the store that only runs on client
export const useSiteStore = create<SiteStore>()((set, get, store) => {
    if (typeof window === 'undefined') {
        return defaultStoreState;
    }
    return createStore(set, get, store);
});

