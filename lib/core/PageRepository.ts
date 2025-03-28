import { ComponentRepository } from "./ComponentRepository";
import { Page, PageArgs, PageWithEvents, SerializedPage } from "./page/Page";


export class PageRepository {

    static createPageWithEvents(args?: PageArgs): PageWithEvents {
        console.log("creating page with events");
        return new PageWithEvents(args || {});
    }

    static serialize(page: Page): SerializedPage { 
        console.log("serializing page");
        return page.serialize();
    }

    static load(serializedPage: SerializedPage): Page {
        const children = serializedPage.children?.map(c => ComponentRepository.loadComponent(c));

        const page = PageRepository.createPageWithEvents({
            id: serializedPage.id,
            props: serializedPage.props,
            children,
        });

        return page;
    }
};
