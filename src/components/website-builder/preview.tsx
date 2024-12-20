"use client";

import { useEffect, useRef } from 'react';
import { Component } from '@/types';
import { generateStaticHTML } from '@/lib/html-generator';

interface PreviewProps {
  components: Component[];
}

export function Preview({ components }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const html = generateStaticHTML(components);
      iframeRef.current.srcdoc = html;
    }
  }, [components]);

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-lg border shadow-sm overflow-hidden">
      <iframe
        ref={iframeRef}
        title="Website Preview"
        className="w-full h-full"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
