import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface OpenHtmlButtonProps {
  html: string,
}

export function OpenHtmlButton({ html }: OpenHtmlButtonProps) {
  const handleOpenInNewTab = async () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    // Clean up the URL object after the window is opened
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleOpenInNewTab}
      className="gap-2"
    >
      <ExternalLink className="h-4 w-4" />
      Open in New Tab
    </Button>
  );
}
