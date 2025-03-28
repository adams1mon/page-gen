import { ComponentPluginManager } from "./ComponentPluginManager";
import { ComponentNode, ComponentWrapperWithEvents, SerializedComponentNode } from "./ComponentWrapper";
import { EventDispatcher, EventType } from "./EventDispatcher";

type SearchMapHandlerParams = {
    component: ComponentNode
}

export class ComponentRepository {

    // TODO: maybe separate this search map into another structure?
    // '_' prefix means this should be referenced only in this file.
    // Can not make it private because it's called by the event dispatcher 
    // from another location.
    static _components: { [key: string]: ComponentNode } = {};

    static createComponentWithEvents(type: string): ComponentWrapperWithEvents {
        const plugin = ComponentPluginManager.getPlugin(type);

        return new ComponentWrapperWithEvents({
            type,
            componentName: plugin.name,
            comp: new plugin.constructorFunc(),
        });
    }

    static loadComponent(serializedComp: SerializedComponentNode): ComponentNode {
        const children = serializedComp.children?.map(c => ComponentRepository.loadComponent(c));

        const plugin = ComponentPluginManager.getPlugin(serializedComp.type);

        const comp: ComponentNode = new ComponentWrapperWithEvents({
            id: serializedComp.id,
            type: serializedComp.type,
            componentName: plugin.name,
            comp: new plugin.constructorFunc(),
            props: serializedComp.props,
            children,
        });

        return comp;
    }

    // -------------   searching components 
    static findComponent(id: string): ComponentNode | undefined {
        return ComponentRepository._components[id];
    }

    static _addToSearchMap({ component }: SearchMapHandlerParams) {
        // add the component and its children to the map
        ComponentRepository._components[component.id] = component;
        component.children?.forEach(c => ComponentRepository._components[c.id] = c);
    }

    static _removeFromSearchMap({ component }: SearchMapHandlerParams) {
        const foundComp = ComponentRepository._components[component.id];
        if (!foundComp) {
            console.warn(`Warning (removing component with id ${component.id} from search map): component does not exist in the repository`);
            return;
        }
        delete ComponentRepository._components[foundComp.id];
    }
};


// TODO: actually use this for searching 
// now they are unused

EventDispatcher.addHandler(
    EventType.COMPONENT_CREATED,
    ComponentRepository._addToSearchMap,
    "repository-add-to-search-handler",
);

EventDispatcher.addHandler(
    EventType.COMPONENT_REMOVED,
    ComponentRepository._removeFromSearchMap,
    "repository-remove-from-search-handler",
);

