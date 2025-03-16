import { ComponentPluginManager } from "./ComponentPluginManager";
import { ComponentNode, ComponentWrapper, SerializedComponentNode } from "./ComponentWrapper";
import { EventDispatcher, EventType } from "./EventDispatcher";


export class ComponentRepository {

    static createComponent(type: string): ComponentNode {
        const plugin = ComponentPluginManager.getPlugin(type);

        return new ComponentWrapper({
            type,
            componentName: plugin.name,
            comp: new plugin.constructorFunc(),
        });
    }

    static saveComponent(comp: ComponentNode): SerializedComponentNode {
        return comp.serialize();
    }

    static loadComponent(serializedComp: SerializedComponentNode): ComponentNode {
        const plugin = ComponentPluginManager.getPlugin(serializedComp.type);

        const comp: ComponentNode = new ComponentWrapper({
            id: serializedComp.id,
            type: serializedComp.type,
            componentName: plugin.name,
            comp: new plugin.constructorFunc(),
            props: serializedComp.props,
            children: serializedComp.children?.map(c => ComponentRepository.loadComponent(c)),
        });
            
        // the parent needs to be set explicitly
        comp.children?.forEach(child => { child.parent = comp });

        EventDispatcher.publish(EventType.COMPONENT_LOADED, { component: comp });
        return comp;
    }
};
