"use client";

import { Button } from "@/components/ui/button";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { hasChildren } from "@/lib/site-generator/generate-html";
import { Download } from "lucide-react";
import { useState } from "react";

interface GenerateSiteButtonProps {
    site: ComponentDescriptor,
    html: string;
}

export function GenerateSiteButton({ site, html }: GenerateSiteButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateSite = async () => {
        try {
            setIsGenerating(true);

            // Create a Blob containing the HTML
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // Create a download link and trigger it
            const a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
                disabled={isGenerating || !hasChildren(site) }
                className="gap-2"
            >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Download HTML'}
            </Button>
        </div>
    );
}
