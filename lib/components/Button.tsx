import { Button as ButtonIcon } from "lucide-react";
import { ComponentContainer } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { customCssDesc } from "./styles/shared";

export const BUTTON_TYPE = "Button";

export interface ButtonProps {
    text: string;
    variant: string;
    size: string;
    customCss: string;
}

function Node(props: ButtonProps) {
    const baseStyles = {
        display: "inline-block",
        padding: props.size === "small" ? "0.5rem 1rem" : props.size === "large" ? "1rem 2rem" : "0.75rem 1.5rem",
        borderRadius: "0.25rem",
        cursor: "pointer",
        border: "none",
        fontSize: props.size === "small" ? "0.875rem" : props.size === "large" ? "1.125rem" : "1rem",
        ...getVariantStyles(props.variant),
        ...JSON.parse(props.customCss || '{}'),
    };

    return (
        <button style={baseStyles}>
            {props.text}
        </button>
    );
}

function getVariantStyles(variant: string) {
    switch (variant) {
        case "primary":
            return {
                backgroundColor: "#0070f3",
                color: "white",
            };
        case "secondary":
            return {
                backgroundColor: "#666",
                color: "white",
            };
        case "outline":
            return {
                backgroundColor: "transparent",
                border: "1px solid #0070f3",
                color: "#0070f3",
            };
        default:
            return {};
    }
}

const defaultProps: ButtonProps = {
    text: "Click me",
    variant: "primary",
    size: "medium",
    customCss: "{}",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Button",
    child: {
        text: {
            type: DataType.STRING,
            displayName: "Text",
            desc: "Button text",
            input: InputType.TEXT,
            default: "Click me",
        },
        variant: {
            type: DataType.STRING,
            displayName: "Variant",
            desc: "Button style (primary, secondary, outline)",
            input: InputType.TEXT,
            default: "primary",
        },
        size: {
            type: DataType.STRING,
            displayName: "Size",
            desc: "Button size (small, medium, large)",
            input: InputType.TEXT,
            default: "medium",
        },
        customCss,
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: BUTTON_TYPE,
    name: "Button",
    icon: <ButtonIcon className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: false,
    childrenDescriptors: [],
};

ComponentContainer.save(BUTTON_TYPE, desc, Node);