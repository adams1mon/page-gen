import { FooterProps } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const defaultProps: FooterProps = {
  email: "email@example.com",
  socialLinks: [
    { text: "GitHub", url: "https://github.com" },
    { text: "LinkedIn", url: "https://linkedin.com" },
    { text: "Twitter", url: "https://twitter.com" }
  ]
};

export function Footer({ 
  email = defaultProps.email,
  socialLinks = defaultProps.socialLinks,
  onChange
}: Partial<FooterProps> & { onChange?: (props: FooterProps) => void }) {
  if (!onChange) {
    return (
      <footer className="w-full py-12 bg-background border-t">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-muted-foreground">{email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Social</h3>
              <div className="space-y-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="block text-muted-foreground hover:text-foreground"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full py-12 bg-background border-t">
      <div className="max-w-5xl mx-auto px-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => onChange({ email: e.target.value, socialLinks })}
              type="email"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Social Links</label>
              <Button
                onClick={() => onChange({
                  email,
                  socialLinks: [...socialLinks, { text: "", url: "" }]
                })}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>

            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Platform"
                  value={link.text}
                  onChange={(e) => {
                    const newLinks = [...socialLinks];
                    newLinks[index] = { ...link, text: e.target.value };
                    onChange({ email, socialLinks: newLinks });
                  }}
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...socialLinks];
                    newLinks[index] = { ...link, url: e.target.value };
                    onChange({ email, socialLinks: newLinks });
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onChange({
                      email,
                      socialLinks: socialLinks.filter((_, i) => i !== index)
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
    </footer>
  );
}
