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
            <label className="text-xs font-medium">{displayName}</label>
        }
        {description &&
            <p className="text-xs text-muted-foreground mt-0.5 mb-0">{description}</p>
        }
        {breadcrumbsPath &&
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 mb-2">
                {breadcrumbsPath.map((item, index) => (
                    <div key={index} className="flex items-center gap-0.5 overflow-x">
                        {index > 0 && <ChevronRight className="h-3 w-3" />}
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        }
    </div>
}