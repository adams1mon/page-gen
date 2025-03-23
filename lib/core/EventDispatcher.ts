import { ComponentNode } from "./ComponentWrapper";
import { Page } from "./page/Page";

type EventHandler = (event: any) => void;

type EventListener = {
    handler: EventHandler;
    nextIndex: number;
}

export class EventDispatcher {

    static maxSize = 100;

    static queues: {
        [eventName: string]: any[]
    } = {};

    static listeners: {
        [eventName: string]: EventListener[]
    } = {};

    static handlerSet: Set<string> = new Set();


    static publish(eventType: string, event: any) {

        if (!this.queues[eventType]) {
            this.queues[eventType] = [];
        } 

        if (this.queues[eventType] && this.queues[eventType].length >= this.maxSize) {
            console.warn("queue max size reached, purging oldest ones");

            // Every old event should already be consumed due to
            // the listeners catching up to the latest message every time.
            // Only newer listeners will miss out on the old deleted ones.
            
            this.queues[eventType].splice(0, this.maxSize);
        }

        this.queues[eventType].push(event);

        // run the handlers for the current event
        if (this.listeners[eventType]) {

            // run the handlers for the last event, catch up with all listeners
            this.listeners[eventType].forEach(listener => this.consumeEvents(eventType, listener));
        }
    }

    static addHandler(eventType: string, handler: EventHandler, handlerKey?: string, startFrom: "beginning" | "end" = "beginning") {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }

        // If this handler already exists, 
        // skip it to avoid registering the same handler for the same event
        // multiple times.
        const key = eventType + handlerKey || handler.name;
        
        if (this.handlerSet.has(key)) return;

        this.handlerSet.add(key);

        const listener = {
            handler: handler,
            nextIndex: startFrom === "beginning" ? 0 : this.queues[eventType].length,
        };
        
        this.listeners[eventType].push(listener);

        // consume all events from the beginning
        if (startFrom === "beginning" && this.queues[eventType]) {
            this.consumeEvents(eventType, listener);
        }

        console.log(this.listeners);
    }

    static consumeEvents(eventType: string, listener: EventListener) {
        while (listener.nextIndex < this.queues[eventType].length) {
            listener.handler(this.queues[eventType][listener.nextIndex]);
            listener.nextIndex += 1;

            console.log("consumed index", listener.nextIndex - 1, "from event", eventType, " -- len", this.queues[eventType].length);
        }
    }
}

// event types
export const EventType = {
    COMPONENT_CREATED: "COMPONENT_CREATED",
    COMPONENT_ADDED: "COMPONENT_ADDED",
    COMPONENT_LOADED: "COMPONENT_LOADED",
    COMPONENT_REMOVED: "COMPONENT_REMOVED",
    EDITOR_TABOVER: "EDITOR_TABOVER",
    EDITOR_TABLEAVE: "EDITOR_TABLEAVE",
}

export interface ComponentCreatedEvent {
    component: ComponentNode;
}

export type ComponentLoadedEvent = ComponentCreatedEvent;

export interface ComponentAddedEvent {
    parent: ComponentNode | Page;
    component: ComponentNode;
    position?: "before" | "after";
}

export interface ComponentRemovedEvent {
    parent: ComponentNode | Page;
    component: ComponentNode;
}

export interface PageEvent {
    page: Page;
}

