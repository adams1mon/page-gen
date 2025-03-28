"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ComponentPluginManager } from "@/lib/core/ComponentPluginManager";
import { Search, Layers } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useComponentSelector } from "@/lib/store/component-selector-store";
import { ComponentRepository } from "@/lib/core/ComponentRepository";

export function ComponentSelector() {
    const [search, setSearch] = useState("");
    const { isOpen, onInsert, close } = useComponentSelector();

    const searchedComponents = ComponentPluginManager.getPlugins()
        .filter(p => {
            return p.name.toLowerCase().includes(search.toLowerCase());
        });

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add Component</DialogTitle>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search components..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                    {searchedComponents.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            No components found
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                            {searchedComponents.map((comp, index) => {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (onInsert) {
                                                onInsert(ComponentRepository.createComponentWithEvents(comp.type));
                                                close();
                                            }
                                        }}
                                        className={cn(
                                            "flex flex-col items-center gap-3 p-4 rounded-lg border bg-card text-card-foreground",
                                            "hover:border-primary/50 hover:shadow-sm transition-all",
                                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        )}
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-background">
                                            <Layers className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="font-medium">
                                                {comp.name}
                                            </span>
                                            {comp.description && (
                                                <span className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                    {comp.description}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
