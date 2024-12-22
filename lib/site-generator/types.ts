import { ComponentConfig } from "@/components/portfolio/types";

// Types for site generation
export interface SiteConfig {
  title: string;
  description: string;
  components: ComponentConfig[];
}

