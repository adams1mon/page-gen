export type ComponentType = 'header' | 'title' | 'markdown' | 'link' | 'image' | 'footer';

export interface Component {
  id: string;
  type: ComponentType;
  content: string;
  props?: Record<string, any>;
}