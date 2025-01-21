type EventHandler = (event: any) => void;

export class EventDispatcher {

    static listeners: { [key: string]: EventHandler[] } = {};

    static publish(eventType: string, event: any) {
        // run the handlers
        this.listeners[eventType]?.forEach(handler => handler(event));
    }

    static addHandler(eventType: string, handler: EventHandler) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }

        this.listeners[eventType].push(handler);
    }
}

// event types
export const EventType = {
    COMPONENT_HTML_CREATED: "COMPONENT_HTML_CREATED",
}

