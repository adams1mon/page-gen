//import { Images } from "lucide-react";
//import { ComponentExport } from "../foo/ComponentContainer";
//import { ComponentDescriptor } from "../foo/ComponentDescriptor";
//import { DataType, InputType, ObjectDesc } from "../../core/props/PropsDescriptor";
//import { cn } from "@/lib/utils";
//import { classNameDesc } from "./common";
//
//export const GALLERY_TYPE = "Gallery";
//
//interface GalleryImage {
//    url: string;
//    alt: string;
//    caption?: string;
//}
//
//export interface GalleryProps {
//    images: GalleryImage[];
//    columns: string;
//    gap: string;
//    aspectRatio: string;
//    className?: string;
//}
//
//function Node(props: GalleryProps) {
//    const baseClasses = "w-full grid";
//    const columnClasses = {
//        '2': 'grid-cols-1 md:grid-cols-2',
//        '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
//        '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
//    };
//    const gapClasses = {
//        'small': 'gap-4',
//        'medium': 'gap-6',
//        'large': 'gap-8'
//    };
//    const aspectClasses = {
//        'square': 'aspect-square',
//        '16/9': 'aspect-video',
//        '4/3': 'aspect-[4/3]'
//    };
//
//    return (
//        <div className={cn(
//            baseClasses,
//            columnClasses[props.columns as keyof typeof columnClasses],
//            gapClasses[props.gap as keyof typeof gapClasses],
//            props.className
//        )}>
//            {props.images.map((image, index) => (
//                <div key={index} className="group relative overflow-hidden rounded-lg">
//                    <div className={cn(
//                        aspectClasses[props.aspectRatio as keyof typeof aspectClasses],
//                        "relative"
//                    )}>
//                        <img 
//                            src={image.url} 
//                            alt={image.alt}
//                            className="absolute inset-0 w-full h-full object-cover"
//                        />
//                    </div>
//                    {image.caption && (
//                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white 
//                                      transform translate-y-full transition-transform duration-200 
//                                      group-hover:translate-y-0">
//                            <p className="text-sm">{image.caption}</p>
//                        </div>
//                    )}
//                </div>
//            ))}
//        </div>
//    );
//}
//
//const defaultProps: GalleryProps = {
//    images: [
//        {
//            url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80",
//            alt: "Gallery image 1",
//            caption: "Image caption"
//        },
//        {
//            url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80",
//            alt: "Gallery image 2",
//            caption: "Image caption"
//        }
//    ],
//    columns: "3",
//    gap: "medium",
//    aspectRatio: "square",
//    className: ""
//};
//
//const propsDescriptor: ObjectDesc = {
//    type: DataType.OBJECT,
//    displayName: "Gallery",
//    child: {
//        images: {
//            type: DataType.ARRAY,
//            displayName: "Images",
//            child: {
//                type: DataType.OBJECT,
//                displayName: "Image",
//                child: {
//                    url: {
//                        type: DataType.STRING,
//                        displayName: "Image URL",
//                        desc: "URL of the image",
//                        input: InputType.URL,
//                        default: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80"
//                    },
//                    alt: {
//                        type: DataType.STRING,
//                        displayName: "Alt Text",
//                        desc: "Alternative text for accessibility",
//                        input: InputType.TEXT,
//                        default: "Gallery image"
//                    },
//                    caption: {
//                        type: DataType.STRING,
//                        displayName: "Caption",
//                        desc: "Optional caption shown on hover",
//                        input: InputType.TEXT,
//                        default: "Image caption"
//                    }
//                }
//            }
//        },
//        columns: {
//            type: DataType.STRING,
//            displayName: "Columns",
//            desc: "Number of columns (2, 3, or 4)",
//            input: InputType.TEXT,
//            default: "3"
//        },
//        gap: {
//            type: DataType.STRING,
//            displayName: "Gap",
//            desc: "Space between images (small, medium, large)",
//            input: InputType.TEXT,
//            default: "medium"
//        },
//        aspectRatio: {
//            type: DataType.STRING,
//            displayName: "Aspect Ratio",
//            desc: "Aspect ratio of images (square, 16/9, 4/3)",
//            input: InputType.TEXT,
//            default: "square"
//        },
//        className: classNameDesc,
//    }
//};
//
//const desc: ComponentDescriptor = {
//    id: "id",
//    type: GALLERY_TYPE,
//    name: "Gallery",
//    icon: <Images className="w-4 h-4" />,
//    props: defaultProps,
//    propsDescriptor,
//    acceptsChildren: false,
//    childrenDescriptors: [],
//};
//
//export default {
//    type: GALLERY_TYPE,
//    descriptor: desc,
//    node: Node,
//} as ComponentExport;
