import { Component } from '@/lib/newcomps/Heading';
import { create } from 'zustand';

interface ComponentClipboard {
    copiedComponent: Component | null;
    copy: (component: Component) => void;
    paste: () => Component | null;
    hasCopiedComponent: () => boolean;
}

export const useComponentClipboard = create<ComponentClipboard>(
    (set, get) => {
        return {
            copiedComponent: null,
            copy: (component: Component) => set(() => ({copiedComponent: component})),
            paste: () => {
                const copied = get().copiedComponent 
                return copied ? copied.clone() : null;
            },
            hasCopiedComponent: () => get().copiedComponent !== null,
        }
    }
);


//interface ComponentClipboardContextType {
//    copiedComponent: ComponentDescriptor | null;
//    copy: (component: ComponentDescriptor) => void;
//    paste: () => ComponentDescriptor | null;
//    hasCopiedComponent: () => boolean;
//}
//
//const ComponentClipboardContext = createContext<ComponentClipboardContextType | undefined>(undefined);
//
//export function ComponentClipboardProvider({ children }: { children: ReactNode }) {
//    const [copiedComponent, setCopiedComponent] = useState<ComponentDescriptor | null>(null);
//
//    const value = {
//        copiedComponent,
//        copy: (component: ComponentDescriptor) => {
//            setCopiedComponent(component);
//        },
//        paste: () => {
//            return copiedComponent ? ComponentContainer.clone(copiedComponent) : null;
//        },
//        hasCopiedComponent: () => copiedComponent !== null,
//    };
//
//    return (
//        <ComponentClipboardContext.Provider value= { value } >
//        { children }
//        < /ComponentClipboardContext.Provider>
//  );
//}
//
//export function useComponentClipboard() {
//    const context = useContext(ComponentClipboardContext);
//    if (context === undefined) {
//        throw new Error('useComponentClipboard must be used within a ComponentClipboardProvider');
//    }
//    return context;
//}
