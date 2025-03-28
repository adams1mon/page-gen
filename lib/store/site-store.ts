"use client";

import { create } from 'zustand';
import { PageRepository } from '../core/PageRepository';
import { Page, PageWithEvents, SerializedPage } from '../core/page/Page';

// TODO: any component that uses this can't be statically rendered
// due to local storage only being available on the client side 

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
    console.log("save state to local storage", state);
    localStorage.setItem(storageKey, JSON.stringify(state));
}

// this should always return sensible defaults, even if there is no saved page
type LoadedState = SaveableState & { site: Page };

function loadStateOrDefault(): LoadedState {
    
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

function defaultPage(): PageWithEvents {
    return PageRepository.createPageWithEvents();
}


export const useSiteStore = create<SiteStore>()((set, get) => {

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
                console.log("autoSave on, invoke saveSite", site);
                
                get().saveSite();
            }
        },

        setAutoSave: (enabled) => set(() => {
            return { autoSave: enabled }
        }),

        saveSite: (name?) => {
            set((state) => {

                const site = get().site;

                const serializedPage = PageRepository.serialize(site);

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

        resetSite: () => set({ site: PageRepository.createPageWithEvents() }),

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
});

