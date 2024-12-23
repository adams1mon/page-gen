//import { HeaderProps } from "./types";
//import { Input } from "@/components/ui/input";
//import { Button } from "@/components/ui/button";
//import { Plus, Trash2 } from "lucide-react";
//
//const defaultProps: HeaderProps = {
//  title: "Your Name",
//  links: [
//    { text: "About", url: "#about" },
//    { text: "Projects", url: "#projects" },
//    { text: "Contact", url: "#contact" }
//  ]
//};
//
//export function Header({ 
//  title = defaultProps.title,
//  links = defaultProps.links,
//  onChange
//}: Partial<HeaderProps> & { onChange?: (props: HeaderProps) => void }) {
//  if (!onChange) {
//    return (
//      <header className="w-full py-6 px-8 bg-background border-b">
//        <div className="max-w-5xl mx-auto">
//          <div className="flex justify-between items-center">
//            <h1 className="text-2xl font-bold">{title}</h1>
//            <nav className="space-x-6">
//              {links.map((link, index) => (
//                <a
//                  key={index}
//                  href={link.url}
//                  className="text-muted-foreground hover:text-foreground"
//                >
//                  {link.text}
//                </a>
//              ))}
//            </nav>
//          </div>
//        </div>
//      </header>
//    );
//  }
//
//  return (
//    <header className="w-full py-6 px-8 bg-background border-b">
//      <div className="max-w-5xl mx-auto">
//        <div className="space-y-8">
//          <div className="space-y-2">
//            <label className="text-sm font-medium">Title</label>
//            <Input
//              value={title}
//              onChange={(e) => onChange({ title: e.target.value, links })}
//              className="text-2xl font-bold"
//            />
//          </div>
//
//          <div className="space-y-4">
//            <div className="flex items-center justify-between">
//              <label className="text-sm font-medium">Navigation Links</label>
//              <Button
//                onClick={() => onChange({
//                  title,
//                  links: [...links, { text: "", url: "" }]
//                })}
//                variant="outline"
//                size="sm"
//              >
//                <Plus className="w-4 h-4 mr-2" />
//                Add Link
//              </Button>
//            </div>
//
//            {links.map((link, index) => (
//              <div key={index} className="flex gap-2">
//                <Input
//                  placeholder="Text"
//                  value={link.text}
//                  onChange={(e) => {
//                    const newLinks = [...links];
//                    newLinks[index] = { ...link, text: e.target.value };
//                    onChange({ title, links: newLinks });
//                  }}
//                />
//                <Input
//                  placeholder="URL"
//                  value={link.url}
//                  onChange={(e) => {
//                    const newLinks = [...links];
//                    newLinks[index] = { ...link, url: e.target.value };
//                    onChange({ title, links: newLinks });
//                  }}
//                />
//                <Button
//                  variant="ghost"
//                  size="icon"
//                  onClick={() => {
//                    onChange({
//                      title,
//                      links: links.filter((_, i) => i !== index)
//                    });
//                  }}
//                >
//                  <Trash2 className="w-4 h-4" />
//                </Button>
//              </div>
//            ))}
//          </div>
//        </div>
//      </div>
//    </header>
//  );
//}
