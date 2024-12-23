import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { AboutProps } from "@/lib/components/About";

export function About(props: AboutProps & { onChange: (props: AboutProps) => void }) {
    return (
        <section className="w-full py-20 bg-background">
            <div className="max-w-5xl mx-auto px-8">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={props.title}
                            onChange={(e) => props.onChange({
                                ...props,
                                title: e.target.value,
                            })}
                            className="text-3xl font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Profile Image URL</label>
                        <Input
                            value={props.imageUrl}
                            onChange={(e) => props.onChange({
                                ...props,
                                imageUrl: e.target.value,
                            })}
                            placeholder="Enter image URL"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Description</label>
                            <Button
                                onClick={() => props.onChange({
                                    ...props,
                                    description: [...props.description, ""]
                                })}
                                variant="outline"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Paragraph
                            </Button>
                        </div>

                        {props.description.map((paragraph, index) => (
                            <div key={index} className="flex gap-2">
                                <Textarea
                                    value={paragraph}
                                    onChange={(e) => {
                                        const newDescription = [...props.description];
                                        newDescription[index] = e.target.value;
                                        props.onChange({
                                            ...props,
                                            description: newDescription,
                                        });
                                    }}
                                    rows={3}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        props.onChange({
                                            ...props,
                                            description: props.description.filter((_, i) => i !== index)
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
        </section>
    );
}
