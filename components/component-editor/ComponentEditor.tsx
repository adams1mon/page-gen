"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSXEditor } from "./JSXEditor";
import { PropsEditor } from "./PropsEditor";
import { IconPicker } from "./IconPicker";
import { ComponentDescriptor } from "@/lib/components/ComponentContainer";

export function ComponentEditor() {
  const [component, setComponent] = useState<Partial<ComponentDescriptor>>({
    type: "",
    name: "",
    props: {},
  });

  const handleSave = () => {
    // TODO: Validate and save component
    console.log("Saving component:", component);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Component Type</Label>
          <Input
            id="type"
            value={component.type}
            onChange={(e) => setComponent({ ...component, type: e.target.value })}
            placeholder="MyCustomComponent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={component.name}
            onChange={(e) => setComponent({ ...component, name: e.target.value })}
            placeholder="My Custom Component"
          />
        </div>

        <IconPicker
          value={component.icon}
          onChange={(icon) => setComponent({ ...component, icon })}
        />
      </div>

      <PropsEditor
        value={component.props}
        onChange={(props) => setComponent({ ...component, props })}
      />

      <JSXEditor
        value={component.jsxFunc?.toString() || ""}
        onChange={(jsxFunc) => setComponent({ ...component, jsxFunc })}
      />

      <Button onClick={handleSave}>Save Component</Button>
    </div>
  );
}