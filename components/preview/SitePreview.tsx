"use client";

import { SiteConfig } from "@/lib/site-generator/generate-html";

interface SitePreviewProps {
  previewHtml: string;
  siteConfig: SiteConfig;
}

export function SitePreview({ previewHtml, siteConfig }: SitePreviewProps) {
  return (
    <div className="h-full bg-gray-50">
      <iframe
        srcDoc={previewHtml}
        className="w-full h-full border-0"
        title={siteConfig.title}
      />
    </div>
  );
}
