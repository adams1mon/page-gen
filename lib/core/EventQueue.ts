
export class EventDispatcher {

    static listeners: {[key: string]: (event: any) => void} = {};

    static publish(eventType: string, event: any) {
        console.log("pushed event", event);
        this.listeners[eventType]?.(event);
    }

    static register(eventName: string, cb: (event: any) => void) {
        this.listeners[eventName] = cb;
    }
}

EventDispatcher.register("addchild", (e: HTMLElement) => {
    console.log("ADDED CHILD", e);

    let color = "inherit";
    let outline = "";
    e.onmouseenter = () => {
        color = e.style.backgroundColor;
        outline = e.style.outline;
        console.log("mouse enter", e, color);
        e.style.backgroundColor = "rgb(200, 0, 0, 0.2)";
        e.style.outline = "2px solid red";
    };

    e.onmouseleave = () => {
        console.log("mouse leave", e, color);
        e.style.backgroundColor = color;
        e.style.outline = outline;
    }
});
