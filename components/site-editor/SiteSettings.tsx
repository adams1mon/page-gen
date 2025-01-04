"use client";

import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { createInputs } from "../component-editor/dynamic-input/create-inputs";
import { CollapsibleSection } from "../ui/collapsible-section";
import { PropInputWrapper } from "../component-editor/dynamic-input/PropInputWrapper";

interface SiteSettingsProps {
    site: ComponentDescriptor;
    onUpdate: (site: ComponentDescriptor) => void;
}

export function SiteSettings({ site, onUpdate }: SiteSettingsProps) {
    return (
        <CollapsibleSection title="Site Settings">
            <PropInputWrapper>
                {
                    createInputs(
                        site.propsDescriptor,
                        site.props,
                        (newProps) => {
                            onUpdate({ ...site, props: newProps });
                        },
                        "site-settings",
                    )
                }
            </PropInputWrapper>
        </CollapsibleSection>
    );
}
