//import { Briefcase } from "lucide-react";
//import { DataType, ObjectDesc } from "../../core/props/PropsDescriptor";
//import { ComponentExport } from "../foo/ComponentContainer";
//import { ComponentDescriptor } from "../foo/ComponentDescriptor";
//import { htmlIdDesc, titleDesc, longTextDesc, imageUrlDesc } from "./common";
//
//export const PROJECTS_TYPE = "Projects";
//
//export interface Project {
//    title: string;
//    description: string;
//    imageUrl: string;
//    link?: string;
//}
//
//export interface ProjectsProps {
//    title: string;
//    projects: Project[];
//    htmlId: string;
//}
//
//function Node(props: ProjectsProps) {
//    return (
//        <section id={props.htmlId} className="w-full py-20 bg-accent">
//            <div className="max-w-5xl mx-auto px-8">
//                <h2 className="text-3xl font-bold mb-12">{props.title}</h2>
//                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                    {props.projects.map((project, index) => (
//                        <div key={index} className="bg-background rounded-lg overflow-hidden">
//                            <div className="aspect-video bg-cover bg-center" style={{
//                                backgroundImage: `url('${project.imageUrl}')`
//                            }}></div>
//                            <div className="p-6">
//                                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
//                                <p className="text-muted-foreground">{project.description}</p>
//                                {project.link &&
//                                    <a href={project.link} className="text-primary hover:underline mt-4 inline-block">
//                                        Learn More →
//                                    </a>
//                                }
//                            </div>
//                        </div>
//                    ))}
//                </div>
//            </div>
//        </section>
//    );
//}
//
//const defaultProps: ProjectsProps = {
//    title: "My Projects",
//    projects: [
//        {
//            title: "Project 1",
//            description: "A brief description of this amazing project and the technologies used.",
//            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
//        },
//        {
//            title: "Project 2",
//            description: "Another exciting project showcasing different skills and technologies.",
//            imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80"
//        },
//        {
//            title: "Project 3",
//            description: "An innovative solution that demonstrates problem-solving abilities.",
//            imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80"
//        }
//    ],
//    htmlId: "projects"
//};
//
//const propsDescriptor: ObjectDesc = {
//    type: DataType.OBJECT,
//    displayName: "Projects section",
//    child: {
//        title: {
//            ...titleDesc,
//            desc: "Title to display above the section.",
//            default: "My projects",
//        },
//        projects: {
//            type: DataType.ARRAY,
//            displayName: "Projects",
//            desc: "Projects to display",
//            child: {
//                type: DataType.OBJECT,
//                displayName: "Project",
//                desc: "Project to showcase",
//                child: {
//                    title: {
//                        ...titleDesc,
//                        desc: "Project title",
//                        default: "Project",
//                    },
//                    description: {
//                        ...longTextDesc,
//                        desc: "Project description",
//                        default: "An innovative solution that demonstrates problem-solving abilities.",
//                    },
//                    imageUrl: {
//                        ...imageUrlDesc,
//                        desc: "Image to display for the project",
//                        default: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80"
//                    },
//                },
//            },
//        },
//        htmlId: { ...htmlIdDesc, default: "projects" },
//    }
//};
//
//const desc: ComponentDescriptor = {
//    id: "id",
//    type: PROJECTS_TYPE,
//    name: "Projects",
//    props: defaultProps,
//    propsDescriptor,
//    icon: <Briefcase className="w-4 h-4" />,
//    acceptsChildren: false,
//    childrenDescriptors: [],
//}
//
//export default {
//    type: PROJECTS_TYPE,
//    descriptor: desc,
//    node: Node,
//} as ComponentExport;
