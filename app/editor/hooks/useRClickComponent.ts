import { ComponentWrapper } from '@/lib/core/ComponentWrapper';
import { create } from 'zustand';

interface RClickedComponent<T> {
    rClickedComponent: ComponentWrapper<T> | null;
    rClickComponent: (comp: ComponentWrapper<T>) => void;
}

export const useRClickedComponent = create<RClickedComponent<any>>(
    (set) => {
        return {
            rClickedComponent: null,
            rClickComponent: (comp) => set(() => ({rClickedComponent: comp})),
        }
    }
);

