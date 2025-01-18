import { Component } from '@/lib/newcomps/types';
import { create } from 'zustand';

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

