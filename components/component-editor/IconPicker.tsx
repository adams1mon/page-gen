"use client";

import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: React.ReactNode;
  onChange: (icon: React.ReactNode) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  const iconList = Object.entries(Icons)
    .filter(([name]) => name !== "createLucideIcon")
    .map(([name, Icon]) => ({
      name,
      icon: <Icon className="h-4 w-4" />,
    }));

  const handleSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    const Icon = Icons[iconName as keyof typeof Icons];
    onChange(<Icon className="h-4 w-4" />);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Component Icon</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedIcon ? (
              <div className="flex items-center gap-2">
                {Icons[selectedIcon as keyof typeof Icons] && 
                  React.createElement(Icons[selectedIcon as keyof typeof Icons], { className: "h-4 w-4" })}
                {selectedIcon}
              </div>
            ) : (
              "Select icon..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search icons..." />
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {iconList.map(({ name, icon }) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIcon === name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    {icon} {name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}