import { Download, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onExport: () => void;
}

export function Header({ onExport }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LayoutTemplate className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Website Builder</h1>
          </div>
          <Button onClick={onExport} variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export HTML
          </Button>
        </div>
      </div>
    </header>
  );
}
