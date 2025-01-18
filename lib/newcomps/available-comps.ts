import { HEADING_TYPE, headingDesc } from "./Heading";
import { ROW_TYPE, Row } from "./Row";
import { ComponentDesc } from "./types";

//export const availableComponents: { [key: string]: () => Component } = {
//    [ROW_TYPE]: () => new Row(),
//    [HEADING_TYPE]: () => new Heading(),
//};

export const compMap: { [key: string]: ComponentDesc } = {
    [HEADING_TYPE]: headingDesc,
};
