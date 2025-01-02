import { PropsDesc} from "@/lib/components/PropsDescriptor";
import { ReactNode } from "react";

export function PropHeader(
    propsDescriptor: PropsDesc,
): ReactNode {
    return (
        <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
        { 
            propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p> 
        }
    );
}
