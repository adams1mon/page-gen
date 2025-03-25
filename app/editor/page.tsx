"use client";

import dynamic from "next/dynamic";

// TODO: entire page and every component in it is rendered on the client side,
// kinda slow...
const PageWrapper = dynamic(() => import("./EditorPage"), {
  ssr: false,
});

export default function EditorPageWrapper() {
    return <PageWrapper/>
};
