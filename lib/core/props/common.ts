import { DataType, InputType, LeafDesc, PropCategory } from "./PropsDescriptor";

export const htmlIdDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "Html id",
    desc: "Html id of the element, if there is a link with '#<id>' on the page, clicking it will scroll to this element.",
    input: InputType.TEXT,
    default: "some-html-id",
    category: PropCategory.METADATA,
}

export const textDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "Text",
    desc: "Text to display.",
    input: InputType.TEXT,
    default: "Random text here",
    category: PropCategory.CONTENT,
};

export const titleDesc: LeafDesc = {
    ...textDesc,
    displayName: "Title",
    desc: "Title to display.",
    default: "Random title",
};

export const longTextDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "Text",
    desc: "Text to display in the section",
    input: InputType.TEXTAREA,
    default: "Longer text here...",
    category: PropCategory.CONTENT,
};

export const urlDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "URL",
    desc: "An arbitrary URL to any type of content.",
    input: InputType.URL,
    default: "https://www.duckduckgo.com",
    category: PropCategory.CONTENT,
};

export const imageUrlDesc: LeafDesc = {
    ...urlDesc,
    displayName: "Image URL",
    desc: "The URL of an image to display.",
    default: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80",
};

export const classNameDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "Custom Classes",
    desc: "Additional Tailwind classes",
    input: InputType.TEXT,
    default: "",
    category: PropCategory.STYLE,
};

export const alignItemsDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "Align Items",
    desc: "Horizontal alignment (stretch, center, flex-start, flex-end)",
    input: InputType.TEXT,
    default: "stretch",
    category: PropCategory.LAYOUT,
};

export const justifyContentDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "Justify Content",
    desc: "Vertical alignment (flex-start, center, flex-end, space-between, space-around)",
    input: InputType.TEXT,
    default: "flex-start",
    category: PropCategory.LAYOUT,
};