import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownProps } from "../portfolio-components/types";
import { Markdown } from "../portfolio-components/Markdown";

interface MarkdownEditorProps {
  value: MarkdownProps;
  onChange: (value: MarkdownProps) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Section Title</label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>

      <Tabs defaultValue="edit">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <Textarea
            value={value.content}
            onChange={(e) => onChange({ ...value, content: e.target.value })}
            placeholder="Enter markdown content..."
            className="min-h-[400px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="border rounded-lg p-4">
            <Markdown {...value} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
