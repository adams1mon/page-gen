import { ABOUT_TYPE } from "@/lib/components/About";
import { FOOTER_TYPE } from "@/lib/components/Footer";
import { HEADER_TYPE } from "@/lib/components/Header";
import { HERO_TYPE } from "@/lib/components/Hero";
import { MARKDOWN_TYPE } from "@/lib/components/Markdown";
import { PROJECTS_TYPE } from "@/lib/components/Projects";
import { Layout, User, Briefcase, Mail, FileText } from "lucide-react";

export const availableComponents = [
  //{ type: HEADER_TYPE, icon: <Layout className="w-4 h-4" />},
  //{ type: HERO_TYPE, icon: <Layout className="w-4 h-4" />},
  { type: ABOUT_TYPE, icon: <User className="w-4 h-4" />},
  //{ type: PROJECTS_TYPE, icon: <Briefcase className="w-4 h-4" />},
  //{ type: MARKDOWN_TYPE, icon: <FileText className="w-4 h-4" />},
  //{ type: FOOTER_TYPE, icon: <Mail className="w-4 h-4" />},
];
