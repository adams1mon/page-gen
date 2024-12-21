import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ComponentConfig } from "../portfolio-components/types";
import { HeaderEditor } from "./HeaderEditor";
import { HeroEditor } from "./HeroEditor";
import { AboutEditor } from "./AboutEditor";
import { ProjectsEditor } from "./ProjectsEditor";
import { FooterEditor } from "./FooterEditor";
import { MarkdownEditor } from "./MarkdownEditor";

interface ComponentEditorProps {
  component: ComponentConfig;
  onUpdate: (updatedComponent: ComponentConfig) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const editorMap: Record<string, React.ComponentType<any>> = {
  header: HeaderEditor,
  hero: HeroEditor,
  about: AboutEditor,
  projects: ProjectsEditor,
  footer: FooterEditor,
  markdown: MarkdownEditor,
};

export function ComponentEditor({ component, onUpdate, open, onOpenChange }: ComponentEditorProps) {
  const Editor = editorMap[component.type];
  if (!Editor) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit {component.type.charAt(0).toUpperCase() + component.type.slice(1)}</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <Editor
            value={component.props}
            onChange={(newProps) => onUpdate({ ...component, props: newProps })}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
