"use client";

import { ReactNode } from 'react';

// client side rendering, wrap everything about this page
//
export default function EditorLayout({
    children,
}: {
    children: ReactNode;
}) {
    return children;
} 
