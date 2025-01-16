import { Component } from '@/lib/newcomps/Heading';
import { create } from 'zustand';

//interface RClickedComponent {
//    rClickedComponent: Component | null;
//    rClickComponent: (comp: Component) => void;
//}

//export const useRClickedComponent = create<RClickedComponent>(
//    (set) => {
//        return {
//            rClickedComponent: null,
//            rClickComponent: (comp) => set(() => ({rClickedComponent: comp})),
//        }
//    }
//);

interface RClickedComponent {
    rClickedComponent: Component | null;
    rClickComponent: (comp: Component) => void;
}

export const useRClickedComponent = create<RClickedComponent>(
    (set) => {
        return {
            rClickedComponent: null,
            rClickComponent: (comp) => set(() => ({rClickedComponent: comp})),
        }
    }
);

