import { ComponentNode } from '@/lib/core/ComponentWrapper';
import { create } from 'zustand';

interface RClickedComponent {
    rClickedComponent: ComponentNode | null;
    rClickComponent: (comp: ComponentNode) => void;
}

export const useRClickedComponent = create<RClickedComponent>(
    (set) => {
        return {
            rClickedComponent: null,
            rClickComponent: (comp) => set(() => ({rClickedComponent: comp})),
        }
    }
);

