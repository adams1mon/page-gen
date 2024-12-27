import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PreviewToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function PreviewToggle({ enabled, onToggle }: PreviewToggleProps) {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onToggle}
      className="gap-2"
    >
      {enabled ? (
        <>
          <EyeOff className="h-4 w-4" />
          Hide Preview
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          Show Preview
        </>
      )}
    </Button>
  );
}
