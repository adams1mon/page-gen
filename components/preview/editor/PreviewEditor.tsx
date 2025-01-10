import { ComponentContainer, insertChild } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE } from "@/lib/components/Site";
import { ReactNode, createElement } from "react";
import { ComponentDivider } from "../../component-editor/component-input/ComponentDivider";
import { EditorContainer } from "./EditorContainer";

export type CompFunc = (comp: ComponentDescriptor) => void;

function wrapTreeWithEditor(
  comp: ComponentDescriptor, 
): ReactNode {
  if (comp.acceptsChildren) {
    comp.props = {
      ...comp.props,
      children: comp.childrenDescriptors.map(wrapTreeWithEditor),
    };
  }

  return (
    <EditorContainer 
      key={comp.id} 
      component={comp} 
    >
      {createElement(
        ComponentContainer.getReactElement(comp.type),
        { ...comp.props, key: comp.id },
      )}
    </EditorContainer>
  );
}

interface CompProps {
  comp: ComponentDescriptor;
  onChange: CompFunc;
}

export function PreviewEditor({ comp, onChange }: CompProps) {

  return (
    <div className="m-4">
      {comp.type === SITE_TYPE
        ? comp.childrenDescriptors.map(wrapTreeWithEditor)
        : wrapTreeWithEditor(comp)
      }
      {comp.acceptsChildren && (
        <div className="p-4">
          <ComponentDivider
            onInsert={c => onChange(insertChild(comp, c))}
          />
        </div>
      )}
    </div>
  );
}
