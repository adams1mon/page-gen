import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileMenu } from "./FileMenu";
import { OpenHtmlButton } from "@/components/OpenHtmlButton";
import { GenerateSiteButton } from "@/components/GenerateSiteButton";

interface EditorToolbarProps {
  onToggleSettings: () => void;
  activeView: string;
  onViewChange: (view: "editor" | "preview") => void;
}

export function EditorToolbar({ onToggleSettings, activeView, onViewChange }: EditorToolbarProps) {
  return (
    <div className="border-b bg-background">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <FileMenu />

          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleSettings}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Site Settings
          </Button>
          <OpenHtmlButton />
          <GenerateSiteButton />
        </div>

        <Tabs value={activeView} onValueChange={onViewChange as (v: string) => void} className="border-none">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
