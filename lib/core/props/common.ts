import {  PropCategory, PropContentType, PropType } from "./PropsDescriptor";
import { PropsDescriptorLeaf } from "./PropsDescriptor";


export const htmlIdDesc: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "Html id",
    desc: "Html id of the element, if there is a link with '#<id>' on the page, clicking it will scroll to this element.",
    contentType: PropContentType.TEXT,
    default: "some-html-id",
    category: PropCategory.METADATA,
}

export const textDesc: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "Text",
    desc: "Text to display.",
    contentType: PropContentType.TEXT,
    default: "Random text here",
    category: PropCategory.CONTENT,
};

export const titleDesc: PropsDescriptorLeaf = {
    ...textDesc,
    displayName: "Title",
    desc: "Title to display.",
    default: "Random title",
};

export const longTextDesc: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "Text",
    desc: "Text to display in the section",
    contentType: PropContentType.TEXTAREA,
    default: "Longer text here...",
    category: PropCategory.CONTENT,
};

export const urlDesc: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "URL",
    desc: "An arbitrary URL to any type of content.",
    contentType: PropContentType.URL,
    default: "https://www.duckduckgo.com",
    category: PropCategory.CONTENT,
};

export const imageUrlDesc: PropsDescriptorLeaf = {
    ...urlDesc,
    displayName: "Image URL",
    desc: "The URL of an image to display.",
    default: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80",
};

export const classNameDesc: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "Custom Classes",
    desc: "Additional Tailwind classes",
    contentType: PropContentType.TEXT,
    default: "",
    category: PropCategory.STYLE,
};

export const alignItemsDesc: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "Align Items",
    desc: "Horizontal alignment (stretch, center, flex-start, flex-end)",
    contentType: PropContentType.TEXT,
    default: "stretch",
    category: PropCategory.LAYOUT,
};

export const justifyContentDesc: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "Justify Content",
    desc: "Vertical alignment (flex-start, center, flex-end, space-between, space-around)",
    contentType: PropContentType.TEXT,
    default: "flex-start",
    category: PropCategory.LAYOUT,
};

export const linkDescriptor: PropsDescriptorLeaf = {
    propType: PropType.LEAF,
    displayName: "Link",
    category: PropCategory.CONTENT,
    contentType: PropContentType.TEXT,
    desc: "An image or video to display behind the text.",
    default: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80",
};
