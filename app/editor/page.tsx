"use client";

import dynamic from "next/dynamic";

const PageWrapper = dynamic(() => import("./PageWrapper"), {
  ssr: false,
});

export default function EditorPage() {
    return <PageWrapper/>
};
