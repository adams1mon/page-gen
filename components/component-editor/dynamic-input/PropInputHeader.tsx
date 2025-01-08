import { ChevronRight } from "lucide-react";

export function PropInputHeader(
    {
        displayName,
        description,
        breadcrumbsPath,
    }: {
        displayName?: string,
        description?: string,
        breadcrumbsPath?: string[],
    }
) {

    if (!displayName && !description && !breadcrumbsPath) 
        return null;
    
    return <div>
        {displayName &&
            <label className="text-sm font-medium py-1">{displayName}</label>
        }
        {description &&
            <p className="text-sm text-muted-foreground my-0">{description}</p>
        }
        {breadcrumbsPath &&
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0 mb-4">
                {breadcrumbsPath.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 overflow-x">
                        {index > 0 && <ChevronRight className="h-4 w-4" />}
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        }
    </div>
}
