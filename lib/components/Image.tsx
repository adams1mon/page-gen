import { Image as ImageIcon } from "lucide-react";
import { ComponentExport } from "../components-meta/ComponentContainer";
import { ComponentDescriptor } from "../components-meta/ComponentDescriptor";
import { DataType, InputType, ObjectDesc } from "../components-meta/PropsDescriptor";
import { cn } from "@/lib/utils";
import { classNameDesc } from "./common";

export const IMAGE_TYPE = "Image";

const objectFitClasses = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
};

export interface ImageProps {
    src: string;
    alt: string;
    width: string;
    height: string;
    objectFit: keyof typeof objectFitClasses;
    className?: string;
}

function Node(props: ImageProps) {
    // Convert size props to Tailwind classes where possible
    const sizeClasses = {
        width: props.width === "100%" ? "w-full" : "",
        height: props.height === "100%" ? "h-full" : "",
    };

    return (
        <img 
            src={props.src}
            alt={props.alt}
            style={{
                // Only use inline styles for specific dimensions
                width: !sizeClasses.width ? props.width : undefined,
                height: !sizeClasses.height ? props.height : undefined,
            }}
            className={cn(
                sizeClasses.width,
                sizeClasses.height,
                objectFitClasses[props.objectFit] || objectFitClasses.cover,
                props.className
            )}
        />
    );
}

const defaultProps: ImageProps = {
    src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=1000",
    alt: "Image description",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    className: "",
};

const propsDescriptor: ObjectDesc = {
    type: DataType.OBJECT,
    displayName: "Image",
    child: {
        src: {
            type: DataType.STRING,
            displayName: "Source URL",
            desc: "URL of the image",
            input: InputType.URL,
            default: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=1000",
        },
        alt: {
            type: DataType.STRING,
            displayName: "Alt Text",
            desc: "Alternative text for accessibility",
            input: InputType.TEXT,
            default: "Image description",
        },
        width: {
            type: DataType.STRING,
            displayName: "Width",
            desc: "Width of the image (e.g., 100%, 300px)",
            input: InputType.TEXT,
            default: "100%",
        },
        height: {
            type: DataType.STRING,
            displayName: "Height",
            desc: "Height of the image (e.g., auto, 300px)",
            input: InputType.TEXT,
            default: "auto",
        },
        objectFit: {
            type: DataType.STRING,
            displayName: "Object Fit",
            desc: "How the image should fit its container (cover, contain, fill, none, scale-down)",
            input: InputType.TEXT,
            default: "cover",
        },
        className: classNameDesc, 
    }
};

const desc: ComponentDescriptor = {
    id: "id",
    type: IMAGE_TYPE,
    name: "Image",
    icon: <ImageIcon className="w-4 h-4" />,
    props: defaultProps,
    propsDescriptor,
    acceptsChildren: false,
    childrenDescriptors: [],
};

export default {
    type: IMAGE_TYPE,
    descriptor: desc,
    node: Node,
} as ComponentExport;
