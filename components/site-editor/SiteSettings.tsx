import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { PropInputs } from "../component-editor/dynamic-input/PropInputs";
import { CollapsibleSection } from "../ui/collapsible-section";

interface SiteSettingsProps {
    site: ComponentDescriptor;
    onUpdate: (site: ComponentDescriptor) => void;
}

export function SiteSettings({ site, onUpdate }: SiteSettingsProps) {
    return (
        <CollapsibleSection title="Site Settings">
            {
                <PropInputs
                    propsDescriptor={site.propsDescriptor}
                    props={site.props}
                    onChange={(newProps) => {
                        onUpdate({ ...site, props: newProps });
                    }}
                    keyProp="site-settings"
                />
            }
        </CollapsibleSection>
    );
}
