/* @flow */

import BlockLayout from './BlockLayout';
import InlineLayout from './InlineLayout';
import type { Bounds, LayoutBuilder, Placement, Dimensions } from '../types';

export default class RootLayout implements LayoutBuilder {
  children: Array<BlockLayout | InlineLayout> = [];
  lastChildLayout: ?(BlockLayout | InlineLayout) = null;
  placement: Placement = { x: 0, y: 0 };
  dimensions: Dimensions = { width: 0, height: 0 };
  insetBounds: Bounds = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  outsetBounds: Bounds = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  calculatePlacement() {
    // NOOP: placement will always be (0,0) for root.
  }

  getDimensionsWithBounds() {
    return this.dimensions;
  }

  calculateDimensions(childLayout: BlockLayout | InlineLayout) {
    const childDimensions = childLayout.getDimensionsWithBounds();
    console.log('root', childDimensions);
    if (childLayout instanceof BlockLayout) {
      this.dimensions.width = Math.max(
        this.dimensions.width,
        childDimensions.width
      );
      this.dimensions.height += childDimensions.height;
    } else if (childLayout instanceof InlineLayout) {
      if (this.lastChildLayout instanceof BlockLayout) {
        this.dimensions.width = Math.max(
          this.dimensions.width,
          childDimensions.width
        );
        this.dimensions.height += childDimensions.height;
      } else if (this.lastChildLayout instanceof InlineLayout) {
        this.dimensions.width += childDimensions.width;
      } else {
        this.dimensions.width = childDimensions.width;
        this.dimensions.height = childDimensions.height;
      }
    }
    this.lastChildLayout = childLayout;
  }

  getJsonTree() {
    return {
      type: RootLayout.name,
      dimensions: this.dimensions,
      placement: this.placement,
      children: this.children.map(child => child.getJsonTree()),
    };
  }
}
