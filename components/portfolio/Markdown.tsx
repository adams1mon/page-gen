import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownProps } from './types';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultProps: MarkdownProps = {
  title: "Markdown Section",
  content: "# Hello World\n\nThis is a markdown section. You can write:\n\n- Lists\n- **Bold text**\n- *Italic text*\n\n## Code\n\n```js\nconsole.log('Hello World');\n```"
};

export function Markdown({ 
  title = defaultProps.title,
  content = defaultProps.content,
  onChange
}: Partial<MarkdownProps> & { onChange?: (props: MarkdownProps) => void }) {
  if (!onChange) {
    return (
      <section className="w-full py-12 bg-background">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-background">
      <div className="max-w-5xl mx-auto px-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Title</label>
            <Input
              value={title}
              onChange={(e) => onChange({ title: e.target.value, content })}
              className="text-2xl font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Content</label>
            <Tabs defaultValue="edit" className="w-full">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Textarea
                  value={content}
                  onChange={(e) => onChange({ title, content: e.target.value })}
                  className="min-h-[400px] font-mono"
                  placeholder="Enter markdown content..."
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="prose prose-slate dark:prose-invert max-w-none border rounded-lg p-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
