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
        // sandboxing from codepen.io
        sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups-to-escape-sandbox allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
