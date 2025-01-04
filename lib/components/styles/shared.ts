import { DataType, InputType, ObjectDesc } from "../../components-meta/PropsDescriptor";

export const customCssDesc: ObjectDesc["child"]["customCss"] = {
    type: DataType.STRING,
    displayName: "Custom CSS",
    desc: "Additional CSS properties in JSON format (e.g., {\"color\": \"#333\"})",
    input: InputType.TEXTAREA,
    default: "{}",
};

export const textAlignDesc: ObjectDesc["child"]["textAlign"] = {
    type: DataType.STRING,
    displayName: "Text Align",
    desc: "Text alignment (left, center, right, justify)",
    input: InputType.TEXT,
    default: "left",
};