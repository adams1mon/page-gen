import { Layout, User, Briefcase, Mail, FileText } from "lucide-react";

export const availableComponents = [
  { type: "header", icon: <Layout className="w-4 h-4" />, title: "Header" },
  { type: "hero", icon: <Layout className="w-4 h-4" />, title: "Hero Section" },
  { type: "about", icon: <User className="w-4 h-4" />, title: "About Me" },
  { type: "projects", icon: <Briefcase className="w-4 h-4" />, title: "Projects" },
  { type: "markdown", icon: <FileText className="w-4 h-4" />, title: "Markdown" },
  { type: "footer", icon: <Mail className="w-4 h-4" />, title: "Footer" },
];
