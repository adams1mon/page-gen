import { ComponentContainer } from "@/lib/components-meta/ComponentContainer";
import { ComponentDivider } from "./ComponentDivider";
import { ComponentEditor } from "../ComponentEditor";
import { ComponentDescriptor } from "@/lib/components-meta/ComponentDescriptor";


interface ComponentInputProps {
    components: ComponentDescriptor[];

    // called with the changed 'components', 
    // should set the updated components them on the parent component
    onChange: (components: ComponentDescriptor[]) => void;
};

// Slot for another component
export function ComponentInput(
    {
        components,
        onChange,
    }: ComponentInputProps
) {
  
    const addComponent = (component: ComponentDescriptor, index?: number) => {
        const newComponents = [...components];
        if (typeof index === 'number') {
            newComponents.splice(index, 0, component);
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
        <div>
            <label className="text-sm font-medium">Children</label>
            <p className="text-sm font-medium">Nested children to add to the component</p>
            <div className="space-y-4">
                {components.length === 0 ? (
                    <ComponentDivider onInsert={(comp) => addComponent(comp, 0)} />
                ) : (
                    components.map((component, index) => (
                        <div key={component.id}>
                            <ComponentDivider
                                onInsert={(comp) => addComponent(comp, index)}
                            />

                            {/* Render the editors of the child components recursively */}
                            <ComponentEditor
                                index={index}
                                component={component}
                                onUpdate={handleComponentUpdate}
                                moveComponent={moveComponent}
                                onDelete={deleteComponent}
                            />
                            {index === components.length - 1 && (
                                <ComponentDivider
                                    onInsert={(comp) => addComponent(comp, index + 1)}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
