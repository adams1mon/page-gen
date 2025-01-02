
export function OptionsMenu(props: React.PropsWithChildren) {
    return (
        <div className="border-b bg-background">
            <div className="flex justify-center w-full items-center p-4">
                <div className="flex items-center gap-4">
                    {props.children}
                </div>
            </div>
        </div>
    );
}
