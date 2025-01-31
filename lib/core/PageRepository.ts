import { ComponentRepository } from "./ComponentRepository";
import { EventDispatcher, EventType } from "./EventDispatcher";
import { Page, SerializedPage } from "./page/Page";


export class PageRepository {

    static createPage(): Page {

        console.log("creating page");
        
        return new Page({});
    }

    static serialize(page: Page): SerializedPage { 
        console.log("serializing page");
        
        return page.serialize();
    }

    static load(serializedPage: SerializedPage): Page {
        const page = new Page({
            id: serializedPage.id,
            props: serializedPage.props,
            children: serializedPage.children?.map(c => ComponentRepository.loadComponent(c)),
        });

        // the parent needs to be set explicitly
        page.children.forEach(child => { child.parent = page });

        return page;
    }
};
