//"use client";
//
//import { ComponentDescriptor } from "@/lib/foo/ComponentDescriptor";
//import { EditorOverlay } from "./EditorOverlay";
//import { EditorContextMenu } from "./EditorContextMenu";
//import { useState } from "react";
//import { ComponentSelector } from "../../component-editor/component-input/ComponentSelector";
//import { removeChild } from "@/lib/foo/ComponentContainer";
//import { Button } from "@/components/ui/button";
//import { Plus } from "lucide-react";
//import { useSiteStore } from "@/lib/store/site-store";
//import { findParentComponent } from "@/lib/foo/ComponentContainer";
//import { updateComponentInTree } from "@/lib/foo/ComponentContainer";
//import { useComponentSelection } from "@/app/editor/hooks/useComponentSelection";
//
//interface EditorContainerProps extends React.PropsWithChildren {
//    component: ComponentDescriptor;
//}
//
//export function EditorContainer({ 
//    component, 
//    children 
//}: EditorContainerProps) {
//    const [isHovered, setIsHovered] = useState(false);
//    const [overlayEnabled, setOverlayEnabled] = useState(false);
//    const { site, setSite } = useSiteStore();
//
//    const { selectComponent } = useComponentSelection();
//
//    const handleRemove  = (comp: ComponentDescriptor) => {
//        const parent = findParentComponent(site, comp);
//        if (parent) {
//            const updatedParent = removeChild(parent, comp);
//            setSite(updateComponentInTree(site, updatedParent));
//        }
//    };
//
//    const handleChildInsert = (newComponent: ComponentDescriptor, position?: 'before' | 'after') => {
//
//        if (position) {
//            const parent = findParentComponent(site, component);
//            if (parent) {
//                parent.addChild?.(newComponent) || console.log("no function");
//
//                //const index = findComponentIndex(parent, component);
//                //const insertIndex = position === 'before' ? index : index + 1;
//                //const updatedParent = insertChild(parent, newComponent, insertIndex);
//                //setSite(updateComponentInTree(site, updatedParent));
//            }
//        } else {
//            component.addChild?.(newComponent) || console.log("no function");
//
//            // Add inside the component as before
//            //const updatedComp = insertChild(component, newComponent);
//            //setSite(updateComponentInTree(site, updatedComp));
//        }
//    };
//
//    const isEmpty = component.acceptsChildren && component.childrenDescriptors.length === 0;
//
//    return (
//        <EditorContextMenu
//            component={component}
//            overlayEnabled={overlayEnabled}
//            onOverlayToggle={() => setOverlayEnabled(prev => !prev)}
//            onEdit={() => selectComponent(component)}
//            onInsert={handleChildInsert}
//            onRemove={handleRemove}
//        >
//            <div
//                className="relative"
//                onMouseEnter={(e) => {
//                    e.stopPropagation();
//                    setIsHovered(true);
//                }}
//                onMouseLeave={(e) => {
//                    e.stopPropagation();
//                    setIsHovered(false);
//                }}
//                onClick={e => e.stopPropagation()}
//            >
//                <EditorOverlay
//                    controlsEnabled={overlayEnabled}
//                    isHovered={isHovered}
//                    component={component}
//                    onEdit={() => selectComponent(component)}
//                    onInsert={handleChildInsert}
//                    onRemove={handleRemove}
//                />
//
//                {children}
//
//                {isEmpty && <EmptyState component={component} onInsert={handleChildInsert} />}
//            </div>
//        </EditorContextMenu>
//    );
//}
//
//function EmptyState({ component, onInsert }: { component: ComponentDescriptor, onInsert: (comp: ComponentDescriptor) => void }) {
//    return (
//        <div className="min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg m-4 p-6">
//            <div className="text-center space-y-2 mb-4">
//                <p className="text-lg font-medium text-muted-foreground">{component.name}</p>
//                <p className="text-sm text-muted-foreground/60">This component is empty.</p>
//            </div>
//            <ComponentSelector onInsert={onInsert} >
//                <Button
//                    variant="outline"
//                    className="bg-background border-border"
//                >
//                    <div className="flex gap-2 text-muted-foreground">
//                        <Plus className="h-4 w-4" />
//                        <span>Add component</span>
//                    </div>
//                </Button>
//            </ComponentSelector>
//        </div>
//    );
//}
