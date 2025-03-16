"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { EditorTab, useEditorTabs } from "@/lib/store/editor-tabs-store";
import { useComponentSelection } from "../hooks/useComponentSelection";
import { ComponentNode } from "@/lib/core/ComponentWrapper";
import { Page } from "@/lib/core/page/Page";
import { EventDispatcher } from "@/lib/core/EventDispatcher";

export function EditorTabs() {
    const { tabs, removeTab } = useEditorTabs();
    const { selectedComponent, selectComponent } = useComponentSelection();

    const tabArray = Object.values(tabs);

    if (tabArray.length == 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-background border-t flex z-50">
            {tabArray.map((tab) => (
                <TabButton
                    key={tab.id}
                    tab={tab}
                    selectedComponent={selectedComponent}
                    onRestore={() => selectComponent(tab.component)}
                    onClose={() => removeTab(tab.id)}
                />
            ))}
        </div>
    );
}

function TabButton({
    tab,
    selectedComponent,
    onRestore,
    onClose
}: {
    tab: EditorTab;
    selectedComponent: ComponentNode | Page | null,
    onRestore: () => void;
    onClose: () => void;
}) {
    return (
        <div
            className={cn(
                "group flex items-center gap-2 px-3 py-1 cursor-pointer",
                "hover:bg-slate-200",
                "border-t border-t-accent border-r border-r-accent",
                selectedComponent && selectedComponent.id === tab.component.id &&
                "bg-slate-200"
            )}
            onClick={onRestore}

            // TODO: very hacky
            onMouseEnter={() => {
                EventDispatcher.publish(`tabover-${tab.component.id}`, null);
            }}
            onMouseLeave={() => {
                EventDispatcher.publish(`tableave-${tab.component.id}`, null);
            }}
        >
            <span className="text-sm truncate max-w-[150px]">
                {tab.component.componentName}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <X className="h-3 w-3 hover:text-destructive" />
            </Button>
        </div>
    );
}
