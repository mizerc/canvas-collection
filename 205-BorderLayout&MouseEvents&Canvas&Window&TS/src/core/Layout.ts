import { Container } from "./Container";
import { Node } from "./Node";
import { Box } from "./Box";
import { Size } from "../utils/Size";
import { BorderLayoutLocationType } from "../layouts/BorderLayout";
import { Position } from "../utils/Position";

/**
 * Layout is an abstract class that defines a contract.
 */
export abstract class Layout {
  name: string;
  owner: Container | null;
  list: Box[];
  constructor(layoutName: string) {
    this.name = layoutName;
    this.owner = null;
    this.list = [];
  }
  add(node: Box, location: BorderLayoutLocationType = "CENTER"): void {
    this.list.push(node);
  }
  abstract measure(): Size;
  abstract arrange(position: Position): void;
}
