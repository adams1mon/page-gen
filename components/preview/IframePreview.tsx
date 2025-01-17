interface IframePreviewProps {
  html: string;
}

export function IframePreview({ html }: IframePreviewProps) {
  return (
    <div className="h-full">
      <iframe
        srcDoc={html}
        className="w-full h-full border-0"
        // sandboxing from codepen.io
        sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups-to-escape-sandbox allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
