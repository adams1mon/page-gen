import { ComponentDescriptor } from '@/lib/components-meta/ComponentDescriptor';
import { create } from 'zustand';

interface RClickedComponent {
    rClickedComponent: ComponentDescriptor | null;
    rClickComponent: (comp: ComponentDescriptor) => void;
}

export const useRClickedComponent = create<RClickedComponent>(
    (set) => {
        return {
            rClickedComponent: null,
            rClickComponent: (comp) => set(() => ({rClickedComponent: comp})),
        }
    }
);

