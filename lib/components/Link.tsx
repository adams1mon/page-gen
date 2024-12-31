import { DataType, ObjectDesc } from "./PropDescriptor";
import { textDesc, urlDesc } from "./common";

export interface Link {
  text: string;
  url: string;
}

export const httpLinkDesc: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Link",
    desc: "Link that points to a website",
    child: {
        text: {
            ...textDesc,
            desc: "Link text to display",
            default: "Google",
        },
        url: {
            ...urlDesc,
            displayName: "Link",
            desc: "URL to route to",
            default: "https://www.google.com",
        },
    }
}
