import { ComponentPluginManager } from "./ComponentPluginManager";
import { ComponentNode, ComponentWrapper, SerializedComponentNode } from "./ComponentWrapper";
import { EventDispatcher, EventType } from "./EventDispatcher";


export class ComponentRepository {

    static createComponent<T>(type: string): ComponentNode<T> {
        const plugin = ComponentPluginManager.getPlugin(type);

        return new ComponentWrapper<T>({
            type,
            componentName: plugin.name,
            comp: new plugin.constructorFunc(),
        });
    }

    static saveComponent(comp: ComponentNode<any>): SerializedComponentNode<any> {
        return comp.serialize();
    }

    static loadComponent<T>(serializedComp: SerializedComponentNode<T>): ComponentNode<T> {
        const plugin = ComponentPluginManager.getPlugin(serializedComp.type);

        const comp = new ComponentWrapper({
            id: serializedComp.id,
            type: serializedComp.type,
            componentName: plugin.name,
            comp: new plugin.constructorFunc(),
            props: serializedComp.props,
            children: serializedComp.children?.map(ComponentRepository.loadComponent),
        });

        EventDispatcher.publish(EventType.COMPONENT_LOADED, { component: comp });
        return comp;
    }
};
