import { ABOUT_TYPE } from "@/lib/components/About";
import { HEADER_TYPE } from "@/lib/components/Header";
import { Layout, User, Briefcase, Mail, FileText } from "lucide-react";

export const availableComponents = [
  { type: HEADER_TYPE, icon: <Layout className="w-4 h-4" />, title: "Header" },
  //{ type: "hero", icon: <Layout className="w-4 h-4" />, title: "Hero Section" },
  { type: ABOUT_TYPE, icon: <User className="w-4 h-4" />, title: "About Me" },
  //{ type: "projects", icon: <Briefcase className="w-4 h-4" />, title: "Projects" },
  //{ type: "markdown", icon: <FileText className="w-4 h-4" />, title: "Markdown" },
  //{ type: "footer", icon: <Mail className="w-4 h-4" />, title: "Footer" },
];
