"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownProps } from './types';

const defaultProps: MarkdownProps = {
  title: "Markdown Section",
  content: "# Hello World\n\nThis is a markdown section. You can write:\n\n- Lists\n- **Bold text**\n- *Italic text*\n\n## Code\n\n```js\nconsole.log('Hello World');\n```"
};

export function Markdown({ 
  title = defaultProps.title,
  content = defaultProps.content 
}: Partial<MarkdownProps>) {

    console.log(title, content);
    
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
