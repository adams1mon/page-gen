import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { availableComponents } from "./available-components";

interface ComponentDividerProps {
  onInsert: (type: string) => void;
}

export function ComponentDivider({ onInsert }: ComponentDividerProps) {
  return (
    <div className="relative h-8 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background border-border"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {availableComponents.map((component) => (
              <DropdownMenuItem
                key={component.type}
                onClick={() => onInsert(component.type)}
                className="flex items-center gap-2"
              >
                {component.icon}
                <span>{component.type}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
