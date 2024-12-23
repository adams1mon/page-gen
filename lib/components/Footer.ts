import { Link } from "./common";

export const FOOTER_TYPE = "footer";

export interface FooterProps {
    email: string;
    socialLinks: Link[];
}

export const defaultFooterProps: FooterProps = {
    email: "email@example.com",
    socialLinks: [
        { text: "GitHub", url: "https://github.com" },
        { text: "LinkedIn", url: "https://linkedin.com" },
        { text: "Twitter", url: "https://twitter.com" }
    ]
};

export function toHtml(props: FooterProps) {
    return `
        <footer class="w-full py-12 bg-background border-t">
          <div class="max-w-5xl mx-auto px-8">
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4">Contact</h3>
                <p class="text-muted-foreground">${props.email}</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-4">Social</h3>
                <div class="space-y-2">
                  ${props.socialLinks.map(link =>
                    `<a href="${link.url}" class="block text-muted-foreground hover:text-foreground">
                      ${link.text}
                    </a>`
                  ).join('')}
                </div>
              </div>
            </div>
          </div>
        </footer>`;
};

