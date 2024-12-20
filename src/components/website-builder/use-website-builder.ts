"use client";

import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { Component, ComponentType } from "@/types";
import { generateStaticHTML } from "@/lib/html-generator";

const initialComponents: Component[] = [
    {
        id: "1",
        type: "header",
        content: "",
        props: {
            text: "Welcome to my website",
            level: 1,
        },
    },
];

export function useWebsiteBuilder() {
    const [components, setComponents] = useState<Component[]>(initialComponents);
    const [selectedType, setSelectedType] = useState<ComponentType>("header");

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setComponents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addComponent = () => {
        const newComponent: Component = {
            id: Date.now().toString(),
            type: selectedType,
            content: "",
            props: {},
        };
        setComponents([...components, newComponent]);
    };

    const updateComponent = (updatedComponent: Component) => {
        setComponents(
            components.map((component) =>
                component.id === updatedComponent.id ? updatedComponent : component
            )
        );
    };

    const generateHTML = () => {
        const html = generateStaticHTML(components);
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "website.html";
        a.click();
        URL.revokeObjectURL(url);
    };

    return {
        components,
        selectedType,
        setSelectedType,
        handleDragEnd,
        addComponent,
        updateComponent,
        generateHTML,
    };
}
