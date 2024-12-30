import { DataType, InputType, ObjectDesc } from "./PropDescriptor";

export interface Link {
  text: string;
  url: string;
}

export const example: Link = {
    text: "Google",
    url: "https://www.google.com",
}

export const linkDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Link",
    child: {
        text: {
            type: DataType.STRING,
            displayName: "Text",
            desc: "Link text to display",
            input: InputType.TEXT,
            default: "Google",
        },
        url: {
            type: DataType.STRING,
            displayName: "Link",
            desc: "URL to route to",
            input: InputType.URL,
            default: "https://www.google.com",
        },
    }
}
