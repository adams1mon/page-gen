"use client";

import { FooterProps } from "./types";

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
  socialLinks = defaultProps.socialLinks 
}: Partial<FooterProps>) {
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
            <div className="space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="text-muted-foreground hover:text-foreground"
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