import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ToggleButtonProps {
  onText: string;
  offText: string;
  enabled: boolean;
  onToggle: () => void;
}

export function ToggleButton({ enabled, onToggle, onText, offText }: ToggleButtonProps) {
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
          {onText}
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          {offText}
        </>
      )}
    </Button>
  );
}
