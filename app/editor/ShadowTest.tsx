import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE, upsertNode } from "@/lib/components/Site";
import { useEffect, useRef, useState } from "react";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { ComponentContainer, findByIdInTree } from "@/lib/components-meta/ComponentContainer";
import { Clipboard, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { ComponentSelector } from "@/components/component-editor/component-input/ComponentSelector";
import { useComponentClipboard } from "@/lib/store/component-clipboard-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useComponentSelection } from "./hooks/useComponentSelection";
import { useSiteStore } from "@/lib/store/site-store";

type CompFunc = (comp: ComponentDescriptor) => void;

interface ContextMenuState {
    component: ComponentDescriptor;
    rect: RectState;
    position: {
        x: number;
        y: number;
    };
}

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

    const { site, setSite } = useSiteStore();

    const [overlay, setOverlay] = useState<OverlayState | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

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

                e.preventDefault();
                e.stopPropagation();

                const id = componentRoot.dataset.id;
                const componentDescriptor = findByIdInTree(site, id);
                if (!componentDescriptor) {
                    console.warn("no component descriptor for id", id);
                    return;
                }

                const rect = componentRoot.getBoundingClientRect();
                setContextMenu({
                    component: componentDescriptor,
                    position: {
                        x: e.pageX,
                        y: e.pageY,
                    },
                    rect,
                });
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

    const handleSiblingInsert = (reference: ComponentDescriptor, newComponent: ComponentDescriptor, position: 'before' | 'after') => {
        ComponentContainer.addSibling(reference, newComponent, position);
        setSite(site);
    };

    const handleInsert = (newComponent: ComponentDescriptor) => {
        ComponentContainer.addChild(site, newComponent);
        setSite(site);
    };

    return (

        <div className="h-full overflow-auto">

            <div className="m-4 border-2 border-red-500" ref={ref}></div>

            {site.acceptsChildren && (
                <div className="p-4">
                    <ComponentDivider
                        onInsert={handleInsert}
                    />
                </div>
            )}

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

            {contextMenu && (
                <div
                    style={{
                        position: 'absolute',
                        left: contextMenu.position.x + 'px',
                        top: contextMenu.position.y + 'px',
                    }}
                >
                    <ComponentContextMenu
                        component={contextMenu.component}
                        onInsert={handleInsert}
                        onInsertBefore={c => {
                            handleSiblingInsert(contextMenu.component, c, 'before');
                        }}
                        onInsertAfter={c => {
                            handleSiblingInsert(contextMenu.component, c, 'after');
                        }}
                        onRemove={handleRemove}
                        onClickOutside={() => setContextMenu(null)}
                    />
                </div>
            )}
        </div>
    );
}

interface ComponentContextMenuProps {
    component: ComponentDescriptor;
    onInsert: CompFunc;
    onInsertBefore: CompFunc;
    onInsertAfter: CompFunc;
    onRemove: CompFunc;
    onClickOutside: () => void;
}

function ComponentContextMenu({
    component,
    onInsert,
    onInsertBefore,
    onInsertAfter,
    onRemove,
    onClickOutside,
}: ComponentContextMenuProps) {

    const { copy, paste, hasCopiedComponent } = useComponentClipboard();
    const { selectComponent } = useComponentSelection();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {

            event.preventDefault();
            event.stopPropagation();

            // don't close when the click is on the menu itself
            if (!(event.target as Element).closest('[role="menu"]')) {
                onClickOutside();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <DropdownMenu open={true}>
            {/* dummy trigger - needed for the component to show up */}
            <DropdownMenuTrigger />
            <DropdownMenuContent className="w-48">
                <DropdownMenuItem className="flex flex-col items-center mb-2">
                    <p className="m-0">{component.name}</p>
                    <hr className="w-full mt-2" />
                </DropdownMenuItem>

                {/* Insert Above */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Insert Above
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <ComponentSelector onInsert={(c) => {
                            onInsertBefore(c);
                            onClickOutside();
                        }}>
                            <DropdownMenuItem>
                                Add Component
                            </DropdownMenuItem>
                        </ComponentSelector>
                        {
                            hasCopiedComponent() && (
                                <DropdownMenuItem onClick={() => {
                                    const comp = paste();
                                    if (comp) onInsertBefore(comp);
                                    onClickOutside();
                                }}>
                                    <Clipboard className="h-4 w-4 mr-2" />
                                    Paste Component
                                </DropdownMenuItem>
                            )
                        }
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Insert Below */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Insert Below
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <ComponentSelector onInsert={(c) => {
                            onInsertAfter(c);
                            onClickOutside();
                        }}>
                            <DropdownMenuItem>
                                Add Component
                            </DropdownMenuItem>
                        </ComponentSelector>
                        {
                            hasCopiedComponent() && (
                                <DropdownMenuItem onClick={() => {
                                    const comp = paste();
                                    if (comp) onInsertAfter(comp);
                                    onClickOutside();
                                }}>
                                    <Clipboard className="h-4 w-4 mr-2" />
                                    Paste Component
                                </DropdownMenuItem>
                            )
                        }
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Add Inside (if component accepts children) */}
                {component.acceptsChildren && (
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Inside
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <ComponentSelector onInsert={(c) => {
                                onInsert(c);
                                onClickOutside();
                            }}>
                                <DropdownMenuItem>
                                    Add Component
                                </DropdownMenuItem>
                            </ComponentSelector>
                            {
                                hasCopiedComponent() && (
                                    <DropdownMenuItem onClick={() => {
                                        const comp = paste();
                                        if (comp) onInsert(comp);
                                        onClickOutside();
                                    }}>
                                        <Clipboard className="h-4 w-4 mr-2" />
                                        Paste Component
                                    </DropdownMenuItem>
                                )
                            }
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                )}

                <DropdownMenuItem
                    onClick={() => {
                        selectComponent(component);
                        onClickOutside();
                    }}
                    className="flex items-center"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit properties
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        copy(component);
                        onClickOutside();
                    }}
                    className="flex items-center"
                >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy component
                </DropdownMenuItem>

                {onRemove && (
                    <DropdownMenuItem
                        onClick={() => {
                            onRemove(component);
                            onClickOutside();
                        }}
                        className="flex items-center text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete component
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

