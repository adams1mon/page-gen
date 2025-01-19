import { useEffect, useRef, useState } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { Clipboard, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { ComponentSelector } from "@/components/component-editor/component-input/ComponentSelector";
import { useComponentSelection } from "./hooks/useComponentSelection";
import { useSiteStore } from "@/lib/store/site-store";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";
import { useRClickedComponent } from "./hooks/useRClickComponent";
import { useComponentClipboard } from "./hooks/useComponentClipboard";
import { ComponentWrapper } from "@/lib/newcomps/types";

type CompFunc = (comp: ComponentWrapper) => void;

interface OverlayState {
    id: string;
    rect: RectState;
}

interface RectState {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ShadowTestProps {
    onChange: () => void;
}

export function ShadowTest({ onChange }: ShadowTestProps) {

    const ref = useRef(null);
    const [overlay, setOverlay] = useState<OverlayState | null>(null);
    const { site } = useSiteStore();
    const { rClickedComponent, rClickComponent } = useRClickedComponent();

    useEffect(() => {

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;

        //if (site.props.styles) {
        //    const sheet = new CSSStyleSheet();
        //    sheet.replaceSync(site.props.styles);
        //    shadow.adoptedStyleSheets = [sheet];
        //    console.log("added styles");
        //}

        const html = shadow.querySelector("html");
        if (html) {
            shadow.replaceChild(site.htmlRoot, html);
        } else {
            shadow.appendChild(site.htmlRoot);
        }

        const handleMouseOver = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const componentRoot = target.closest('[data-id]');
            const id = componentRoot?.dataset.id;
            if (componentRoot && !id.startsWith('Site')) {

                e.preventDefault();
                e.stopPropagation();

                const component = site.findChildById(id);
                if (!component) {
                    console.warn("no component for id in site", id);
                    return;
                }

                const rect = componentRoot.getBoundingClientRect();
                setOverlay({
                    id,
                    rect: {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                    },
                });
            }
        };

        const handleMouseOut = () => {
            setOverlay(null);
        };

        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const componentRoot = target.closest('[data-id]');
            if (componentRoot && !componentRoot.dataset.id.startsWith('Site')) {

                const id = componentRoot.dataset.id;

                const component = site.findChildById(id);
                if (!component) {
                    console.warn("no component for id in site", id);
                    return;
                }

                rClickComponent(component);
            }
        };

        shadow.addEventListener('mouseover', handleMouseOver);
        shadow.addEventListener('mouseout', handleMouseOut);
        shadow.addEventListener('contextmenu', handleContextMenu);

        return () => {
            shadow.removeEventListener('mouseover', handleMouseOver);
            shadow.removeEventListener('mouseout', handleMouseOut);
            shadow.removeEventListener('contextmenu', handleContextMenu);
        };

    //}, [site, ref.current]);
    }, [ref.current]);

    const handleRemove = (comp: ComponentWrapper) => {
        site.removeChild(comp);
        onChange();
    };

    const handleSiblingInsert = (reference: ComponentWrapper | null, newComponent: ComponentWrapper, position: 'before' | 'after') => {
        console.log("sibling insert", position);
        if (!reference) return;
        reference.addSibling(newComponent, position);
        onChange();
    };

    const handleInsert = (newComponent: ComponentWrapper) => {
        site.addChild(newComponent);
        console.log("add comp", newComponent);
        onChange();
    };

    return (
        <div className="h-full overflow-auto">
            <ComponentContextMenu
                onInsert={handleInsert}
                onInsertBefore={c => {
                    handleSiblingInsert(rClickedComponent, c, 'before');
                }}
                onInsertAfter={c => {
                    handleSiblingInsert(rClickedComponent, c, 'after');
                }}
                onRemove={handleRemove}
            >

                {/* shadow host for the preview */}
                <div
                    className="m-4 border-2 border-red-500"
                    ref={ref}
                ></div>

                {overlay && (
                    <div
                        style={{
                            position: 'absolute',
                            left: overlay.rect.x + window.scrollX + 'px',
                            top: overlay.rect.y + window.scrollY + 'px',
                            width: overlay.rect.width + 'px',
                            height: overlay.rect.height + 'px',
                            border: '2px solid blue',
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </ComponentContextMenu>

            <div className="p-4">
                <ComponentDivider
                    onInsert={handleInsert}
                />
            </div>
        </div>
    );
}

interface ComponentContextMenuProps extends React.PropsWithChildren {
    onInsert: CompFunc;
    onInsertBefore: CompFunc;
    onInsertAfter: CompFunc;
    onRemove: CompFunc;
}

function ComponentContextMenu({
    onInsert,
    onInsertBefore,
    onInsertAfter,
    onRemove,
    children,
}: ComponentContextMenuProps) {

    const { copy, paste, hasCopiedComponent } = useComponentClipboard();
    const { selectComponent } = useComponentSelection();

    const [isOpen, setIsOpen] = useState(true);

    const { rClickedComponent } = useRClickedComponent();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // don't close when the click is on the menu itself
            if (isOpen && !(event.target as Element).closest('[role="menu"]')) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    function pasteMenuItem() {
        return hasCopiedComponent() && (
            <ContextMenuItem onClick={() => {
                const comp = paste();
                if (comp) onInsertAfter(comp);
                setIsOpen(false);
            }}>
                <Clipboard className="h-4 w-4 mr-2" />
                Paste Component
            </ContextMenuItem>
        );
    }

    return (
        <ContextMenu open={isOpen} onOpenChange={setIsOpen}>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            {rClickedComponent &&
                <ContextMenuContent className="w-48">
                    <ContextMenuItem className="flex flex-col items-center mb-2">
                        <p className="m-0">{rClickedComponent.type}</p>
                        <hr className="w-full mt-2" />
                    </ContextMenuItem>

                    {/* Insert Above */}
                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Insert Above
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ComponentSelector onInsert={(c) => {
                                onInsertBefore(c);
                                setIsOpen(false);
                            }}>
                                <ContextMenuItem>
                                    Add Component
                                </ContextMenuItem>
                            </ComponentSelector>
                            {pasteMenuItem()}
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    {/* Insert Below */}
                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Insert Below
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ComponentSelector onInsert={(c) => {
                                onInsertAfter(c);
                                setIsOpen(false);
                            }}>
                                <ContextMenuItem>
                                    Add Component
                                </ContextMenuItem>
                            </ComponentSelector>
                            {pasteMenuItem()}
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    {/* Add Inside (if component accepts children) */}
                    {"children" in rClickedComponent && (
                        <ContextMenuSub>
                            <ContextMenuSubTrigger className="flex items-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Inside
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <ComponentSelector onInsert={(c) => {
                                    onInsert(c);
                                    setIsOpen(false);
                                }}>
                                    <ContextMenuItem>
                                        Add Component
                                    </ContextMenuItem>
                                </ComponentSelector>
                                {
                                    hasCopiedComponent() && (
                                        <ContextMenuItem onClick={() => {
                                            const comp = paste();
                                            if (comp) onInsert(comp);
                                            setIsOpen(false);
                                        }}>
                                            <Clipboard className="h-4 w-4 mr-2" />
                                            Paste Component
                                        </ContextMenuItem>
                                    )
                                }
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    )}

                    <ContextMenuItem
                        onClick={() => {
                            selectComponent(rClickedComponent);
                            setIsOpen(false);
                        }}
                        className="flex items-center"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit properties
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={() => {
                            copy(rClickedComponent);
                            setIsOpen(false);
                        }}
                        className="flex items-center"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy component
                    </ContextMenuItem>

                    {onRemove && (
                        <ContextMenuItem
                            onClick={() => {
                                onRemove(rClickedComponent);
                                setIsOpen(false);
                            }}
                            className="flex items-center text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete component
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            }
        </ContextMenu>
    );
}

