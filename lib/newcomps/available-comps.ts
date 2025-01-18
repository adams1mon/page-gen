import { ROW_TYPE, Row } from "./Row";
import { HEADING_TYPE, Heading } from "./Heading";
import { Component } from "./types";

export const availableComponents: { [key: string]: () => Component } = {
    [HEADING_TYPE]: () => new Heading(),
    [ROW_TYPE]: () => new Row(),
};
