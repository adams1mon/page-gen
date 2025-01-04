"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function CollapsibleSection({ 
    title, 
    children, 
    defaultOpen = true 
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-background hover:bg-accent rounded-t-lg border cursor-pointer">
                <h2 className="text-lg font-semibold">{title}</h2>
                <Settings className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isOpen && "rotate-90"
                )} />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="p-4 border-x border-b rounded-b-lg space-y-4">
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
