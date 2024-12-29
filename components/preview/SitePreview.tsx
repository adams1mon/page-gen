import { ComponentDescriptor } from "@/lib/components/ComponentContainer";
import { SiteProps } from "@/lib/components/Site";


interface SitePreviewProps {
  site: ComponentDescriptor;
  html: string;
}

export function SitePreview({ site, html }: SitePreviewProps) {
  return (
    <div className="h-full bg-gray-50">
      <iframe
        srcDoc={html}
        className="w-full h-full border-0"
        title={(site.props as SiteProps).title}
      />
    </div>
  );
}
