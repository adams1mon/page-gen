import { ComponentWrapper } from '@/lib/newcomps/types';
import { create } from 'zustand';

interface RClickedComponent {
    rClickedComponent: ComponentWrapper | null;
    rClickComponent: (comp: ComponentWrapper) => void;
}

export const useRClickedComponent = create<RClickedComponent>(
    (set) => {
        return {
            rClickedComponent: null,
            rClickComponent: (comp) => set(() => ({rClickedComponent: comp})),
        }
    }
);

