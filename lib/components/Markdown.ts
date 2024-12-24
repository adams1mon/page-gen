import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ComponentConfig } from './Component';
import { ComponentContainer } from './ComponentContainer';

export const MARKDOWN_TYPE = "markdown";

export interface MarkdownProps {
    title: string;
    content: string;
}

const defaultMarkdownProps = {
    title: "Markdown Section",
    content: "# Hello World\n\nThis is a markdown section. You can write:\n\n- Lists\n- **Bold text**\n- *Italic text*\n\n## Code\n\n```js\nconsole.log('Hello World');\n```"
};

function toHtml(props: MarkdownProps) {
    // Note: For production, you'd want to use a markdown parser here
    // TODO: SANITIZE MD

    // manually create a JSX node and render HTML
    const element = createElement(
        ReactMarkdown,
        {
            remarkPlugins: [remarkGfm]
        },
        props.content,
    );
    const content = renderToString(element);

    return `
        <section class="w-full py-12 bg-background">
          <div class="max-w-5xl mx-auto px-8">
            <h2 class="text-2xl font-bold mb-6">${props.title}</h2>
            <div class="prose">
              ${content}
            </div>
          </div>
        </section>`;
};


function createConfig(): ComponentConfig {
    return {
        id: `${MARKDOWN_TYPE}-${Date.now()}`,
        type: MARKDOWN_TYPE,
        props: defaultMarkdownProps,
    }
}

ComponentContainer.register(MARKDOWN_TYPE, createConfig, toHtml);

