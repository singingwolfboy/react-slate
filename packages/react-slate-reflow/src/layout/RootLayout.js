/* @flow */

import ContainerLayout from './ContainerLayout';
import UnitLayout from './UnitLayout';
import type { Bounds, LayoutBuilder, Placement, Dimensions } from '../types';

export default class RootLayout implements LayoutBuilder {
  children: Array<ContainerLayout | UnitLayout> = [];
  lastChildLayout: ?(ContainerLayout | UnitLayout) = null;
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

  calculateDimensions(childLayout: ContainerLayout | UnitLayout) {
    // TODO: make this code shareable between RootLayout and ContainerLayout, since it's the same
    const childDimensions = childLayout.getDimensionsWithBounds();
    if (childLayout instanceof ContainerLayout) {
      this.dimensions.width = Math.max(
        this.dimensions.width,
        childDimensions.width
      );
      this.dimensions.height += childDimensions.height;
    } else if (childLayout instanceof UnitLayout) {
      if (this.lastChildLayout instanceof ContainerLayout) {
        this.dimensions.width = Math.max(
          this.dimensions.width,
          childDimensions.width
        );
        this.dimensions.height += childDimensions.height;
      } else if (this.lastChildLayout instanceof UnitLayout) {
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
      // $FlowFixMe
      children: this.children.map((child: ContainerLayout | UnitLayout) =>
        child.getJsonTree()
      ),
    };
  }
}
