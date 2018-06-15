/* @flow */

import InlineLayout from './InlineLayout';
import Node from '../nodes/Node';
import type { LayoutBuilder, Placement, Dimensions } from '../types';

export default class BlockLayout implements LayoutBuilder {
  node: Node;
  parentLayout: BlockLayout;
  children: Array<BlockLayout | InlineLayout> = [];
  placement: Placement = { x: 0, y: 0 };
  dimensions: Dimensions = { width: 0, height: 0 };
  lastChildLayout: ?(BlockLayout | InlineLayout) = null;

  constructor(node: Node, parentLayout: BlockLayout) {
    this.node = node;
    this.parentLayout = parentLayout;
    parentLayout && parentLayout.children.push(this);
  }

  calculatePlacement() {
    this.placement = {
      x: this.parentLayout.placement.x,
      y: this.parentLayout.placement.y + this.parentLayout.dimensions.height,
    };
  }

  calculateDimensions(childLayout: BlockLayout | InlineLayout) {
    if (childLayout instanceof BlockLayout) {
      this.dimensions.width = Math.max(
        this.dimensions.width,
        childLayout.dimensions.width
      );
      this.dimensions.height += childLayout.dimensions.height;
    } else if (childLayout instanceof InlineLayout) {
      if (this.lastChildLayout instanceof BlockLayout) {
        this.dimensions.width = Math.max(
          this.dimensions.width,
          childLayout.dimensions.width
        );
        this.dimensions.height += childLayout.dimensions.height;
      } else if (this.lastChildLayout instanceof InlineLayout) {
        this.dimensions.width += childLayout.dimensions.width;
      } else {
        this.dimensions.width = childLayout.dimensions.width;
        this.dimensions.height = childLayout.dimensions.height;
      }
    }
    this.lastChildLayout = childLayout;
  }

  getJsonTree() {
    return {
      type: BlockLayout.name,
      dimensions: this.dimensions,
      placement: this.placement,
      children: this.children.map(child => child.getJsonTree()),
    };
  }
}
