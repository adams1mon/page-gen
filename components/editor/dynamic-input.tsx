"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { PropsDesc, LeafDesc, ArrayDesc, ObjectDesc, createDefaultProps, DataType, InputType, ComponentSlotDesc } from "@/lib/components/PropsDescriptor";
import { ComponentDivider } from "./ComponentDivider";
import { ComponentContainer, ComponentDescriptor } from "@/lib/components/ComponentContainer";
import { ComponentEditor } from "./ComponentEditor";


export function createInputs(
    propsDescriptor: PropsDesc,
    props: any,
    onChange: (props: any) => void,
    key: string = '',
): ReactNode {

    switch (propsDescriptor.type) {
        case DataType.STRING:
            return stringInput(
                propsDescriptor as LeafDesc,
                props as string,
                onChange,
                key,
            );

        case DataType.NUMBER:
            return numberInput(
                propsDescriptor as LeafDesc,
                props as number,
                onChange,
                key,
            );

        case DataType.ARRAY:
            return arrayInput(
                propsDescriptor as ArrayDesc,
                props as any,
                onChange,
                key,
            );

        case DataType.OBJECT:
            return objectInput(
                propsDescriptor as ObjectDesc,
                props as strKeyObj,
                onChange,
                key,
            );

        case DataType.COMPONENT_SLOT:
            return componentInput(
                propsDescriptor as ComponentSlotDesc,
                props,
                onChange,
                key,
            );

        default:
            console.error(`PropsDesc type is undefined or not implemented, displayName: ${propsDescriptor.displayName}, type: ${propsDescriptor.type}. Ensure every descriptor has a 'type' and a 'displayName' attribute.`);
    }
}

function stringInput(
    propsDescriptor: LeafDesc,
    str: string,
    onChange: (str: string) => void,
    key: string,
): ReactNode {

    return <div
        key={key}
        className="mt-4"
    >
        <label className="text-sm font-medium py-1">{propsDescriptor.displayName}</label>
        {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
        {propsDescriptor.input == InputType.TEXTAREA &&
            <Textarea
                className="text-sm font-normal"
                value={str}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
            />
        }

        {propsDescriptor.input == InputType.TEXT &&
            <Input
                type="text"
                value={str}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm font-bold"
            />
        }

        {propsDescriptor.input == InputType.URL &&
            <Input
                type="url"
                value={str}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm font-bold"
            />
        }
    </div>
}

function numberInput(propsDescriptor: LeafDesc, num: number, onChange: (num: number) => void, key: string): ReactNode {
    return (
        <div key={key} className="mt-4">
            <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
            {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
            <Input
                type="number"
                value={num}
                onChange={(e) => onChange(Number(e.target.value))}
                className="text-sm font-bold"
            />
        </div>
    );
}

function arrayInput(propsDescriptor: ArrayDesc, props: any[], onChange: (props: any[]) => void, key: string): ReactNode {
    return (
        <Card key={key} className="w-full mt-4 p-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
                {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
                <Button
                    onClick={() => onChange([...props, ...createDefaultProps(propsDescriptor)])}
                    variant="outline"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            </div>

            {props.map((p: any, i: number) => (
                <div key={key + i}>
                    {createInputs(
                        propsDescriptor.child,
                        p,
                        (partialProps) => onChange([...props.slice(0, i), partialProps, ...props.slice(i + 1)]),
                        key + " " + (i + 1)
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onChange(props.filter((_: any, fi: number) => fi !== i))}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </Card>
    );
}

interface strKeyObj {
    [key: string]: any,
};

function objectInput(
    propsDescriptor: ObjectDesc,
    props: strKeyObj,
    onChange: (props: strKeyObj) => void,
    key: string,
): ReactNode {

    return (
        <Card key={key} className="w-full mt-4 p-2">
            <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
            {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
            {
                Object.keys(props).map(k =>
                    createInputs(
                        propsDescriptor.child[k],
                        props[k],
                        (partialProps) => onChange({
                            ...props,
                            [k]: partialProps,
                        }),
                        k
                    )
                )
            }
        </Card>
    );
}

function componentInput(
    propsDescriptor: ComponentSlotDesc,
    components: ComponentDescriptor[],
    onChange: (components: ComponentDescriptor[]) => void,
    key: string,
): ReactNode {

    // TODO: render ComponentEditor
    // TODO: DND

    const addComponent = (type: string, index?: number) => {
        const newComponent = ComponentContainer.createInstance(type);

        const newComponents = [...components];
        if (typeof index === 'number') {
            newComponents.splice(index, 0, newComponent);
        }
        onChange(newComponents);
    };

    const handleComponentUpdate = (updatedComponent: ComponentDescriptor) => {
        const newComponents = components.map(component =>
            component.id === updatedComponent.id ? updatedComponent : component
        );
        onChange(newComponents);
    };

    const moveComponent = (dragIndex: number, hoverIndex: number) => {
        const newComponents = [...components];
        const draggedComponent = newComponents[dragIndex];
        newComponents.splice(dragIndex, 1);
        newComponents.splice(hoverIndex, 0, draggedComponent);
        onChange(newComponents);
    };

    const deleteComponent = (id: string) => {
        const newComponents = components.filter(component => component.id !== id)
        onChange(newComponents);
    };


    return (
        <div className="overflow-y-auto" key={key}>
            <label className="text-sm font-medium">{propsDescriptor.displayName}</label>
            {propsDescriptor.desc && <p className="text-sm font-medium">{propsDescriptor.desc}</p>}
            <div className="space-y-4">
                {components.length === 0 ? (
                    <div className="space-y-4">
                        <ComponentDivider onInsert={(type) => addComponent(type, 0)} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {components.map((component, index) => (
                            <div key={component.id}>
                                <ComponentDivider
                                    onInsert={(type) => addComponent(type, index)}
                                />
                                <ComponentEditor
                                    index={index}
                                    component={component}
                                    onUpdate={handleComponentUpdate}
                                    moveComponent={moveComponent}
                                    onDelete={deleteComponent}
                                />
                                {index === components.length - 1 && (
                                    <ComponentDivider
                                        onInsert={(type) => addComponent(type, index + 1)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
