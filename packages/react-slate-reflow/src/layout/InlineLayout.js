/* @flow */

import BlockLayout from './BlockLayout';
import Text from '../nodes/Text';
import type { LayoutBuilder, Placement, Dimensions } from '../types';

export default class InlineLayout implements LayoutBuilder {
  parentLayout: BlockLayout;
  node: Text;
  placement: Placement = { x: 0, y: 0 };
  dimensions: Dimensions = { width: 0, height: 0 };

  constructor(node: Text, parentLayout: BlockLayout) {
    this.node = node;
    this.parentLayout = parentLayout;
    parentLayout.children.push(this);
    this.dimensions.width = node.body.length;
    this.dimensions.height = 1;
  }

  calculatePlacement() {
    if (this.parentLayout.lastChildLayout instanceof InlineLayout) {
      this.placement = {
        x: this.parentLayout.placement.x + this.parentLayout.dimensions.width,
        y: this.parentLayout.placement.y,
      };
    } else {
      this.placement = {
        x: this.parentLayout.placement.x,
        y: this.parentLayout.placement.y + this.parentLayout.dimensions.height,
      };
    }
    this.placement.x += this.parentLayout.insetBounds.left;
    this.placement.y += this.parentLayout.insetBounds.top;
  }

  getDimensionsWithBounds() {
    return this.dimensions;
  }

  getJsonTree() {
    return {
      type: InlineLayout.name,
      dimensions: this.dimensions,
      placement: this.placement,
      body: this.node.body,
    };
  }
}
