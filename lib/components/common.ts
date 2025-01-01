import { DataType, InputType, LeafDesc, ObjectDesc } from "./PropsDescriptor"


export const htmlIdDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "Html id",
    desc: "Html id of the element, if there is a link with '#<id>' on the page, clicking it will scroll to this element.",
    input: InputType.TEXT,
    default: "some-html-id",
}

export const textDesc : LeafDesc = {
    type: DataType.STRING,
    displayName: "Text",
    desc: "Text to display.",
    input: InputType.TEXT,
    default: "Random text here",
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
};

export const urlDesc: LeafDesc = {
    type: DataType.STRING,
    displayName: "URL",
    desc: "An arbitrary URL to any type of content.",
    input: InputType.URL,
    default: "https://www.duckduckgo.com",
}

export const imageUrlDesc: LeafDesc = {
    ...urlDesc,
    displayName: "Image URL",
    desc: "The URL of an image to display.",
    default: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80",
}
