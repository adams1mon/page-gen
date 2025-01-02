import { ComponentContainer, ComponentDescriptor } from "@/lib/components/ComponentContainer";
import { ComponentSlotDesc } from "@/lib/components/PropsDescriptor";
import { ReactNode } from "react";
import { ComponentDivider } from "../ComponentDivider";
import { ComponentPropsEditor } from "../ComponentPropsEditor";


// Slot for another component
export function ComponentInput(
    propsDescriptor: ComponentSlotDesc,
    components: ComponentDescriptor[],

    // called with the changed 'components', 
    // should set the updated components them on the parent component
    onChange: (components: ComponentDescriptor[]) => void,

    key: string,
): ReactNode {

    // TODO: drag and drop

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
                                
                                {/* Render the editors of the child components recursively */}
                                <ComponentPropsEditor
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
