import { ComponentNode } from "./ComponentWrapper";
import { Page } from "./page/Page";

type EventHandler = (event: any) => void;

export class EventDispatcher {

    static maxSize = 100;

    static queues: {
        [eventName: string]: any[]
    } = {};

    static listeners: {
        [eventName: string]: {
            handler: EventHandler;
            nextIndex: number;
        }[]
    } = {};

    static handlerSet: Set<string> = new Set();


    static publish(eventType: string, event: any) {

        if (!this.queues[eventType]) {
            this.queues[eventType] = [];
        } else if (this.queues[eventType] && this.queues[eventType].length >= this.maxSize) {
            console.warn("queue max size reached, purging oldest ones");

            // Every old event should already be consumed due to
            // the listeners catching up to the latest message every time.
            // Only newer listeners will miss out on the old deleted ones.
            
            this.queues[eventType].splice(0, this.maxSize);
        }

        this.queues[eventType].push(event);

        // run the handlers for the current event
        if (this.listeners[eventType]) {

            // run the handlers for the last event
            this.listeners[eventType].forEach(listener => {

                // catch up with all listeners
                while (listener.nextIndex < this.queues[eventType].length) {
                    listener.handler(this.queues[eventType][listener.nextIndex]);
                    listener.nextIndex += 1;

                    console.log("consumed index", listener.nextIndex - 1, "from event", eventType, " -- len", this.queues[eventType].length);
                }
            });
        }
    }

    static addHandler(eventType: string, handler: EventHandler, handlerKey?: string, startFrom: "beginning" | "end" = "beginning") {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }

        // if this handler already exists, skip it
        // to avoid registering the same handler for the same event
        // multiple times
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
            while (listener.nextIndex < this.queues[eventType].length) {
                listener.handler(this.queues[eventType][listener.nextIndex]);
                listener.nextIndex += 1;

                console.log("consumed index", listener.nextIndex - 1, "from event", eventType, " -- len", this.queues[eventType].length);
            }
        }

        console.log(this.listeners);
    }
}

// event types
export const EventType = {
    COMPONENT_ADDED: "COMPONENT_ADDED",
    COMPONENT_LOADED: "COMPONENT_LOADED",
    COMPONENT_UPDATED: "COMPONENT_UPDATED",
    COMPONENT_REMOVED: "COMPONENT_REMOVED",
}

export interface ComponentTreeEvent {
    parent: ComponentNode<any> | Page;
    component: ComponentNode<any>;
}

