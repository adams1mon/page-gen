import { marked } from 'marked';
import { Component } from '@/types';

interface ComponentRendererProps {
  component: Component;
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const renderComponent = () => {
    switch (component.type) {
      case 'header':
        const HeaderTag = `h${component.props?.level || 1}` as keyof JSX.IntrinsicElements;
        return <HeaderTag className="font-bold mb-4">{component.props?.text}</HeaderTag>;

      case 'markdown':
        return (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(component.content) }}
          />
        );

      case 'link':
        return (
          <a
            href={component.props?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {component.props?.text}
          </a>
        );

      case 'image':
        return (
          <img
            src={component.props?.src}
            alt={component.props?.alt}
            className="max-w-full h-auto rounded-lg"
          />
        );

      case 'footer':
        return (
          <footer className="text-center text-muted-foreground py-4">
            {component.content}
          </footer>
        );

      default:
        return null;
    }
  };

  return <div className="w-full">{renderComponent()}</div>;
}