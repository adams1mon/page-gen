import { ComponentContainer, insertChild, removeChild, updateChild } from "@/lib/components-meta/ComponentContainer";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE } from "@/lib/components/Site";
import { ReactNode, createElement } from "react";
import { ComponentDivider } from "../../component-editor/component-input/ComponentDivider";
import { EditorContainer } from "./EditorContainer";

export type CompFunc = (comp: ComponentDescriptor) => void;

function wrapTreeWithEditor(
  comp: ComponentDescriptor, 
  onChange: CompFunc, 
  onRemove?: CompFunc,
  onSelect?: (comp: ComponentDescriptor) => void
): ReactNode {
  if (comp.acceptsChildren) {
    comp.props = {
      ...comp.props,
      children: comp.childrenDescriptors.map(c => wrapTreeWithEditor(
        c,
        updated => onChange(updateChild(comp, updated)),
        toRemove => onChange(removeChild(comp, toRemove)),
        onSelect
      )),
    };
  }

  return (
    <EditorContainer 
      key={comp.id} 
      component={comp} 
      onChange={onChange} 
      onRemove={onRemove}
      onSelect={onSelect}
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
  onComponentSelect?: (comp: ComponentDescriptor) => void;
}

export function PreviewEditor({ comp, onChange, onComponentSelect }: CompProps) {
  return (
    <div className="m-4">
      {comp.type === SITE_TYPE
        ? comp.childrenDescriptors.map(d => wrapTreeWithEditor(
          d,
          updated => onChange(updateChild(comp, updated)), 
          toRemove => onChange(removeChild(comp, toRemove)),
          onComponentSelect
        ))
        : wrapTreeWithEditor(comp, onChange, undefined, onComponentSelect)
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
