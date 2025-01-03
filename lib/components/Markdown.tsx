import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ComponentContainer, ComponentDescriptor } from './ComponentContainer';
import { FileText } from 'lucide-react';
import { DataType, InputType, ObjectDesc } from './PropsDescriptor';
import { htmlIdDesc, titleDesc } from "./common";

export const MARKDOWN_TYPE = "Markdown";

export interface MarkdownProps {
    title: string;
    content: string;
    htmlId: string;
}

function Node(props: MarkdownProps) {
    return (
        <section id={props.htmlId} className="w-full py-12 bg-background">
            <div className="max-w-5xl mx-auto px-8">
                <h2 className="text-2xl font-bold mb-6">{props.title}</h2>
                <div className="prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {props.content}
                    </ReactMarkdown>
                </div>
            </div>
        </section>
    );
}

const defaultProps: MarkdownProps = {
    title: "Markdown Section",
    content: "# Hello World\n\nThis is a markdown section. You can write:\n\n- Lists\n- **Bold text**\n- *Italic text*\n\n## Code\n\n```js\nconsole.log('Hello World');\n```",
    htmlId: "markdown"
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Markdown section",
    child: {
        title: {
            ...titleDesc,
            desc: "Title to display above the section.",
            default: "Markdown section",
        },
        content: {
            type: DataType.STRING,
            displayName: "Markdown Content",
            desc: "Markdown content to render.",
            input: InputType.TEXTAREA,
            default: "# Hello World\n\nThis is a markdown section. You can write:\n\n- Lists\n- **Bold text**\n- *Italic text*\n\n## Code\n\n```js\nconsole.log('Hello World');\n```",
        },
        htmlId: { ...htmlIdDesc, default: "markdown" },
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: MARKDOWN_TYPE,
    name: "Markdown",
    props: defaultProps,
    propsDescriptor,
    icon: <FileText className="w-4 h-4" />,
    customComponent: false,
    jsxFunc: Node,
}

ComponentContainer.save(MARKDOWN_TYPE, desc);
