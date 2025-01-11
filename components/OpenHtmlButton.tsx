"use client";

import { Button } from "@/components/ui/button";
import { createHtml } from "@/lib/site-generator/generate-html";
import { useSiteStore } from "@/lib/store/site-store";
import { ExternalLink } from "lucide-react";

export function OpenHtmlButton() {

    const { site } = useSiteStore();

    const handleOpenInNewTab = async () => {

        //const html = await generateHtml(site);

        const html = createHtml(site).outerHTML;

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
