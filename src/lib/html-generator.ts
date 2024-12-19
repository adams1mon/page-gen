import { marked } from "marked";
import { Component } from "@/types";

export function generateStaticHTML(components: Component[]): string {
  const componentsHTML = components
    .map((component) => {
      switch (component.type) {
        case "header":
          return `<h${component.props?.level || 1} class="text-4xl font-bold mb-4">${
            component.props?.text
          }</h${component.props?.level || 1}>`;
        case "markdown":
          return `<div class="prose">${marked(component.content)}</div>`;
        case "link":
          return `<a href="${component.props?.url}" class="text-blue-600 hover:underline">${component.props?.text}</a>`;
        case "image":
          return `<img src="${component.props?.src}" alt="${component.props?.alt}" class="max-w-full h-auto rounded-lg">`;
        case "footer":
          return `<footer class="text-center text-gray-600 py-4">${component.content}</footer>`;
        default:
          return "";
      }
    })
    .join("\n");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
    <div class="max-w-4xl mx-auto px-4 py-8">
        ${componentsHTML}
    </div>
</body>
</html>`;
}