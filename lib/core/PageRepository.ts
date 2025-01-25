import { ComponentRepository } from "./ComponentRepository";
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

    static deserialize(serializedPage: SerializedPage): Page {
        const p = new Page({
            id: serializedPage.id,
            props: serializedPage.props,
            children: serializedPage.children?.map(c => ComponentRepository.loadComponent(c)),
        });

        console.log("load page - created elements");

        return p;
    }
};
