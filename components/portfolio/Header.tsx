import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { HeaderProps } from "@/lib/components/Header";


export function Header(props: HeaderProps & { onChange: (props: HeaderProps) => void }) {

    return (
        <header className="w-full py-6 px-8 bg-background border-b">
            <div className="max-w-5xl mx-auto">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={props.title}
                            onChange={(e) => props.onChange({
                                ...props,
                                title: e.target.value,
                            })}
                            className="text-2xl font-bold"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Navigation Links</label>
                            <Button
                                onClick={() => props.onChange({
                                    ...props,
                                    links: [...props.links, { text: "", url: "" }]
                                })}
                                variant="outline"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Link
                            </Button>
                        </div>

                        {props.links.map((link, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    placeholder="Text"
                                    value={link.text}
                                    onChange={(e) => {
                                        const newLinks = [...props.links];
                                        newLinks[index] = { ...link, text: e.target.value };
                                        props.onChange({ ...props, links: newLinks });
                                    }}
                                />
                                <Input
                                    placeholder="URL"
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...props.links];
                                        newLinks[index] = { ...link, url: e.target.value };
                                        props.onChange({ ...props, links: newLinks });
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        props.onChange({
                                            ...props,
                                            links: props.links.filter((_, i) => i !== index)
                                        });
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
