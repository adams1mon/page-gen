import { availableComponents } from "@/components/portfolio/available-components";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CatalogPage() {

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Component Catalog</h1>
            <p className="text-muted-foreground">Preview available components for your portfolio</p>
          </div>
        </div>

        <div className="space-y-12">
          {availableComponents.map((component) => (
            <div key={component.type} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                {component.icon}
                <h2 className="text-xl font-semibold">{component.title}</h2>
              </div> 

              <p>TODO: add the things here, {component.type}</p>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
