import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SiteSettings } from "@/components/site-editor/SiteSettings";
import { ComponentSettings } from "./ComponentSettings";

interface EditorSidebarProps {
  selectedComponent: ComponentDescriptor | null;
  site: ComponentDescriptor;
  onSiteUpdate: (site: ComponentDescriptor) => void;
  onComponentUpdate: (component: ComponentDescriptor) => void;
  onPopOut: () => void;
  onClose: () => void;
}

export function EditorSidebar({
  selectedComponent,
  site,
  onSiteUpdate,
  onComponentUpdate,
  onPopOut,
  onClose,
}: EditorSidebarProps) {
  return (
    <div className="h-full overflow-y-auto border-l bg-background">
      <div className="p-4">
        {selectedComponent ? (
          <ComponentSettings
            component={selectedComponent}
            onChange={onComponentUpdate}
            onPopOut={onPopOut}
            onClose={onClose}
          />
        ) : (
          <SiteSettings site={site} onUpdate={onSiteUpdate} />
        )}
      </div>
    </div>
  );
}
