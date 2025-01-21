import { ComponentNode } from '@/lib/core/ComponentWrapper';
import { create } from 'zustand';

interface RClickedComponent<T> {
    rClickedComponent: ComponentNode<T> | null;
    rClickComponent: (comp: ComponentNode<T>) => void;
}

export const useRClickedComponent = create<RClickedComponent<any>>(
    (set) => {
        return {
            rClickedComponent: null,
            rClickComponent: (comp) => set(() => ({rClickedComponent: comp})),
        }
    }
);

