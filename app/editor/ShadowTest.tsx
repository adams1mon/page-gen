import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";
import { SITE_TYPE, upsertNode } from "@/lib/components/Site";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ShadowEditorContainer } from "./ShadowEditorContainer";
import { ComponentDivider } from "@/components/component-editor/component-input/ComponentDivider";
import { ComponentContainer, findByIdInTree } from "@/lib/components-meta/ComponentContainer";
import { ContextMenuContent, ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@radix-ui/react-context-menu";
import { Copy, Edit, Plus, Trash2 } from "lucide-react";
import { ComponentSelector } from "@/components/component-editor/component-input/ComponentSelector";
import { Switch } from "@radix-ui/react-switch";
import { useComponentClipboard } from "@/lib/store/component-clipboard-context";
import { ContextMenu } from "@/components/ui/context-menu";
export type CompFunc = (comp: ComponentDescriptor) => void;

function createEditorContainers(
    comp: ComponentDescriptor,
): ReactNode {

    if (comp.acceptsChildren) {
        return (
            <ShadowEditorContainer key={comp.id} component={comp}>
                {comp.childrenDescriptors.map(createEditorContainers)}
            </ShadowEditorContainer>
        );
    }

    return (
        <ShadowEditorContainer key={comp.id} component={comp} />
    );
}

interface CompProps {
    comp: ComponentDescriptor;
    onChange: CompFunc;
}

export function ShadowTest({ comp, onChange }: CompProps) {

    const ref = useRef(null);

    const [overlay, setOverlay] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {

        if (!ref.current) return;

        if (!ref.current.shadowRoot) {
            ref.current.attachShadow({ mode: "open" });
            console.log("attached shadow");
        }

        const shadow = ref.current.shadowRoot as ShadowRoot;

        if (comp.type == SITE_TYPE) {
            if (comp.props.styles) {
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(comp.props.styles);
                shadow.adoptedStyleSheets = [sheet];
                console.log("added styles");
            }
        }

        if (!comp.domNode) {
            console.warn("no DOM node", comp);
        } else {
            upsertNode("html", shadow, comp.domNode);
        }


        // experiment
        const handleMouseOver = (e: Event) => {
            const target = e.target as HTMLElement;
            console.log("mouseover", target);

            if (!target) return;

            const componentRoot = target.closest('[data-id]');
            if (componentRoot) {

                e.preventDefault();
                e.stopPropagation();

                const rect = componentRoot.getBoundingClientRect();
                setOverlay({
                    id: componentRoot.dataset.id,
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
            if (componentRoot) {

                e.preventDefault();
                e.stopPropagation();

                const rect = componentRoot.getBoundingClientRect();
                setContextMenu({
                    id: componentRoot.dataset.id,
                    position: { x: e.pageX, y: e.pageY },
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

    }, [comp, ref.current]);

    console.log("render shadowtest", comp);


    return (
        <>
            <div className="m-4 border-2 border-red-500" ref={ref}></div>
            {
                //comp.type == SITE_TYPE ?
                //    comp.childrenDescriptors.map(createEditorContainers)
                //    :
                //    createEditorContainers(comp)
            }

            {comp.acceptsChildren && (
                <div className="p-4">
                    <ComponentDivider
                        onInsert={c => {
                            ComponentContainer.addChild(comp, c);
                            onChange(comp);
                        }}
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
                        backgroundColor: 'white',
                        border: '1px solid gray',
                        zIndex: 1000,
                    }}
                >
                    {
                        //<ul>
                        //    <li onClick={() => console.log("edit", contextMenu.id)}>Edit</li>
                        //    <li onClick={() => console.log("delete", contextMenu.id)}>Delete</li>
                        //</ul>

                    }
                    <MyContextMenu
                        component={findByIdInTree(contextMenu.id)}
                        overlayEnabled={false}
                        overlayToggle={() => console.log("overlayToggle")}
                        onEdit={() => console.log("edit")}
                        onInsert={() => console.log("insert")}
                        onRemove={() => console.log("remove")}
                    />
                </div>
            )}

        </>
    );
}

function MyContextMenu(
    component,
    overlayEnabled,
    onOverlayToggle,
    onEdit,
    onInsert,
    onRemove,
) {

    const { copy, paste, hasCopiedComponent } = useComponentClipboard();
    //const [isOpen, setIsOpen] = useState(true);

    return (
        <ContextMenu>
            <ContextMenuContent className="w-48">
                <ContextMenuItem className="flex flex-col items-center mb-2">
                    <p className="m-0">{component.name}</p>
                    <hr className="w-full mt-2" />
                </ContextMenuItem>

                {/* Insert Above */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Insert Above
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ComponentSelector onInsert={(comp) => onInsert(comp, 'before')}>
                            <ContextMenuItem>
                                Add Component
                            </ContextMenuItem>
                        </ComponentSelector>
                        {
                            //hasCopiedComponent() && (
                            //<ContextMenuItem onClick={() => {
                            //    const comp = paste();
                            //    if (comp) onInsert(comp, 'before');
                            //}}>
                            //    <Clipboard className="h-4 w-4 mr-2" />
                            //    Paste Component
                            //</ContextMenuItem>
                            //)
                        }
                    </ContextMenuSubContent>
                </ContextMenuSub>

                {/* Insert Below */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Insert Below
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ComponentSelector onInsert={(comp) => onInsert(comp, 'after')}>
                            <ContextMenuItem>
                                Add Component
                            </ContextMenuItem>
                        </ComponentSelector>
                        {
                            //    hasCopiedComponent() && (
                            //    <ContextMenuItem onClick={() => {
                            //        const comp = paste();
                            //        if (comp) onInsert(comp, 'after');
                            //    }}>
                            //        <Clipboard className="h-4 w-4 mr-2" />
                            //        Paste Component
                            //    </ContextMenuItem>
                            //)
                        }
                    </ContextMenuSubContent>
                </ContextMenuSub>

                {/* Add Inside (if component accepts children) */}
                {component.acceptsChildren && (
                    <ContextMenuSub>
                        <ContextMenuSubTrigger className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Inside
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ComponentSelector onInsert={onInsert}>
                                <ContextMenuItem>
                                    Add Component
                                </ContextMenuItem>
                            </ComponentSelector>
                            {
                                //    hasCopiedComponent() && (
                                //    <ContextMenuItem onClick={() => {
                                //        const comp = paste();
                                //        if (comp) onInsert(comp);
                                //    }}>
                                //        <Clipboard className="h-4 w-4 mr-2" />
                                //        Paste Component
                                //    </ContextMenuItem>
                                //)
                            }
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                )}

                <ContextMenuItem onClick={onEdit} className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit properties
                </ContextMenuItem>

                <ContextMenuItem
                    onClick={() => copy(component)}
                    className="flex items-center"
                >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy component
                </ContextMenuItem>

                <ContextMenuItem
                    className="flex items-center"
                    onClick={onOverlayToggle}
                >
                    <Switch checked={overlayEnabled} className="transition-none" />
                    Overlay enabled
                </ContextMenuItem>

                {onRemove && (
                    <ContextMenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove(component);
                        }}
                        className="flex items-center text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete component
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
