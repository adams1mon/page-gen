import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface OpenInNewTabProps {
  html: string,
}

export function OpenInNewTab({ html }: OpenInNewTabProps) {
  const handleOpenInNewTab = async () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up the URL object after the window is opened
    setTimeout(() => URL.revokeObjectURL(url), 0);
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
