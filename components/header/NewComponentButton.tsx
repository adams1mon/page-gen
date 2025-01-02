import { Code2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function NewComponentButton() {

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2"
        >
            <Code2 className="h-4 w-4" />
            <Link href="/components/new">
                New Component
            </Link>
        </Button>
    );
}
