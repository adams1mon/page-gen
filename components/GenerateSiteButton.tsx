"use client";

import { Button } from "@/components/ui/button";
import { useSiteStore } from "@/lib/store/site-store";
import { Download } from "lucide-react";
import { useState } from "react";

export function GenerateSiteButton() {
    const [isGenerating, setIsGenerating] = useState(false);

    const { site } = useSiteStore();

    const generateSite = async () => {

        try {
            setIsGenerating(true);

            // TODO: clean up the generated cloned site, remove wrappers and all that, very janky.
            // The CREATED events are fired for the clone too so the wrappers get added.
            // TODO: maybe add a constructor param that doesn't fire events - avoid any side effects??
            const cloned = site.deepClone();
            cloned.removeWrapperOverlays();

            const html = cloned.getHtml();

            // Create a Blob containing the HTML
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // Create a download link and trigger it
            const a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio.html';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating site:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={generateSite}
                disabled={isGenerating}
                className="gap-2"
            >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Download HTML'}
            </Button>
        </div>
    );
}
