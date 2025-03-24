"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FileText, Save, Upload, Download, Trash2, RotateCcw } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FileMenu() {
    const { toast } = useToast();
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [saveName, setSaveName] = useState("");
    const {
        site,
        currentPage,
        autoSave,
        savedPages,
        setSite,
        setAutoSave,
        saveSite,
        loadSite,
        resetSite,
        deleteSavedSite,
    } = useSiteStore();

    const handleSave = (name?: string) => {
        try {
            saveSite(name);
            toast({
                title: "Site saved successfully",
                description: name ? `Saved as "${name}"` : "Auto-saved successfully",
            });
        } catch (error) {
            toast({
                title: "Error saving site",
                description: "Failed to save site configuration",
                variant: "destructive",
            });
        }
    };

    const handleExport = () => {
        try {
            const siteData = JSON.stringify(site);
            const blob = new Blob([siteData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'site-config.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            toast({
                title: "Error exporting site",
                description: "Failed to export site configuration",
                variant: "destructive",
            });
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            try {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                const text = await file.text();
                const siteData = JSON.parse(text);
                setSite(siteData);

                toast({
                    title: "Site imported successfully",
                    description: "Site configuration has been loaded",
                });
            } catch (error) {
                toast({
                    title: "Error importing site",
                    description: "Failed to import site configuration",
                    variant: "destructive",
                });
            }
        };
        input.click();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <FileText className="h-4 w-4" />
                        File
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        Page: {currentPage}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSave()}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSaveDialog(true)}>
                        <Save className="h-4 w-4 mr-2" />
                        Save As...
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Upload className="h-4 w-4 mr-2" />
                            Load Saved Site
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            {Object.keys(savedPages).length === 0 ? (
                                <DropdownMenuItem disabled>No saved sites</DropdownMenuItem>
                            ) : (
                                Object.keys(savedPages).map((name) => (
                                    <DropdownMenuItem
                                        key={name}
                                        onClick={() => loadSite(name)}
                                        className="flex justify-between"
                                    >
                                        {name}
                                        <Trash2
                                            className="h-4 w-4 ml-2 text-destructive hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteSavedSite(name);
                                            }}
                                        />
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuItem onClick={handleImport}>
                        <Download className="h-4 w-4 mr-2" />
                        Import
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExport}>
                        <Upload className="h-4 w-4 mr-2" />
                        Export
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuCheckboxItem
                        checked={autoSave}
                        onCheckedChange={setAutoSave}
                    >
                        Auto Save
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={resetSite}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Default
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Site As</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={saveName}
                                onChange={(e) => setSaveName(e.target.value)}
                                placeholder="Enter a name for this save"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                if (saveName) {
                                    handleSave(saveName);
                                    setShowSaveDialog(false);
                                    setSaveName("");
                                }
                            }}
                            disabled={!saveName}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
