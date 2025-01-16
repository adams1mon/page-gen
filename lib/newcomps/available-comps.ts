import { ROW_TYPE, Row } from "./Row";
import { Component, HEADING_TYPE, Heading } from "./Heading";

export const availableComponents: { [key: string]: () => Component } = {
    [ROW_TYPE]: () => new Row(),
    [HEADING_TYPE]: () => new Heading(),
};
