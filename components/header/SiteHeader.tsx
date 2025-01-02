import Link from "next/link";
import { ReactNode } from "react";


export function SiteHeader(
    {children} : React.PropsWithChildren,
): ReactNode {
    return (
        <div className="border-b bg-background">
            <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">
                    <Link href="/">
                        Portfolio Builder
                    </Link>
                </h1>
                <div className="flex items-center gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
