"use client";

import { Button } from "@/components/ui/button";
import { useSiteStore } from "@/lib/store/site-store";
import { ExternalLink } from "lucide-react";

export function OpenHtmlButton() {

    const { site } = useSiteStore();

    // TODO: fix
    if (!site) {
        return;
    }

    const handleOpenInNewTab = async () => {

        const html = site.htmlRoot?.outerHTML;
        if (!html) {
            console.warn("no site DOM node found when trying to get HTML");
            return;
        }

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        // Clean up the URL object after the window is opened
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            className="gap-2"
        >
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
        </Button>
    );
}
