import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE, upsertNode } from "@/lib/components/Site";
import { useEffect, useRef, useState } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { ComponentContainer, findByIdInTree } from "@/lib/components-meta/ComponentContainer";
import { Clipboard, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { ComponentSelector } from "@/components/component-editor/component-input/ComponentSelector";
import { useComponentClipboard } from "@/lib/store/component-clipboard-context";
import { useComponentSelection } from "./hooks/useComponentSelection";
import { useSiteStore } from "@/lib/store/site-store";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";
import { useRClickedComponent } from "./useRClickComponent";

type CompFunc = (comp: ComponentDescriptor) => void;

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

export function ShadowTest() {

    const ref = useRef(null);
    const [overlay, setOverlay] = useState<OverlayState | null>(null);
    const { site, setSite } = useSiteStore();
    const { rClickedComponent, rClickComponent } = useRClickedComponent();

    useEffect(() => {

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;

        if (site.type == SITE_TYPE) {
            if (site.props.styles) {
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(site.props.styles);
                shadow.adoptedStyleSheets = [sheet];
                console.log("added styles");
            }
        }

        if (!site.domNode) {
            console.warn("no DOM node", site);
            return;
        } else {
            upsertNode("html", shadow, site.domNode);
        }

        const handleMouseOver = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const componentRoot = target.closest('[data-id]');
            const id = componentRoot?.dataset.id;
            if (componentRoot && !id.startsWith('Site')) {

                e.preventDefault();
                e.stopPropagation();

                const rect = componentRoot.getBoundingClientRect();
                const componentDescriptor = findByIdInTree(site, id);
                if (!componentDescriptor) {
                    console.warn("no component descriptor for id", id);
                    return;
                }

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
                const componentDescriptor = findByIdInTree(site, id);
                if (!componentDescriptor) {
                    console.warn("no component descriptor for id", id);
                    return;
                }

                rClickComponent(componentDescriptor);
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

    }, [site, ref.current]);

    const handleRemove = (comp: ComponentDescriptor) => {
        ComponentContainer.removeChild(comp);
        setSite(site);
    };

    const handleSiblingInsert = (reference: ComponentDescriptor | null, newComponent: ComponentDescriptor, position: 'before' | 'after') => {
        if (!reference) return;
        ComponentContainer.addSibling(reference, newComponent, position);
        setSite(site);
    };

    const handleInsert = (newComponent: ComponentDescriptor) => {
        ComponentContainer.addChild(site, newComponent);
        setSite(site);
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

            {site.acceptsChildren && (
                <div className="p-4">
                    <ComponentDivider
                        onInsert={handleInsert}
                    />
                </div>
            )}
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
                        <p className="m-0">{rClickedComponent.name}</p>
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
                                console.log("set is open to false");

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
                    {rClickedComponent.acceptsChildren && (
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

