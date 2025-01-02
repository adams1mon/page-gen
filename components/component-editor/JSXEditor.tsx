"use client";

import Editor from "@monaco-editor/react";

interface JSXEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const defaultValue = `function Component(props) {
  return (
    <div className="w-full py-12 bg-background">
      <div className="max-w-5xl mx-auto px-8">
        {/* Your component JSX here */}
      </div>
    </div>
  );
}`;

export function JSXEditor({ value, onChange }: JSXEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Component JSX</label>
      <div className="border rounded-lg overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage="javascript"
          defaultValue={value || defaultValue}
          onChange={(value) => onChange(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}
