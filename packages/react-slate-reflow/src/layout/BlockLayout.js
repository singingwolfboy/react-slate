/* @flow */

import InlineLayout from './InlineLayout';
import Node from '../nodes/Node';
import normalizeLayoutProps from './normalizeLayoutProps';
import { makeBlockStyle } from './makeStyle';
import type { Bounds, LayoutBuilder, Placement, Dimensions } from '../types';

export default class BlockLayout implements LayoutBuilder {
  node: Node;
  parentLayout: BlockLayout;
  children: Array<BlockLayout | InlineLayout> = [];
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
  lastChildLayout: ?(BlockLayout | InlineLayout) = null;

  constructor(node: Node, parentLayout: BlockLayout) {
    this.node = node;
    this.parentLayout = parentLayout;

    parentLayout && parentLayout.children.push(this);
    if (node && node.layoutProps) {
      const { insetBounds, outsetBounds } = normalizeLayoutProps(
        node.layoutProps
      );
      this.insetBounds = insetBounds;
      this.outsetBounds = outsetBounds;
    }
  }

  calculatePlacement() {
    this.placement = {
      x:
        this.parentLayout.placement.x +
        this.parentLayout.insetBounds.left +
        this.outsetBounds.left,
      y:
        this.parentLayout.placement.y +
        this.parentLayout.insetBounds.top +
        this.parentLayout.dimensions.height +
        this.outsetBounds.top,
    };
  }

  /**
   * Get dimensions with both outset and inset bounds.
   * For parent layout element, this layout element's height and width
   * should include outset bounds also.
   */
  getDimensionsWithBounds() {
    const ownDimensions = this.getOwnDimensions();
    return {
      width:
        this.outsetBounds.left + ownDimensions.width + this.outsetBounds.right,
      height:
        this.outsetBounds.top + ownDimensions.height + this.outsetBounds.bottom,
    };
  }

  /**
   * Get dimensions with inset bounds.
   * Inset bounds are part of this layout element's height and width.
   */
  getOwnDimensions() {
    return {
      width:
        this.dimensions.width + this.insetBounds.left + this.insetBounds.right,
      height:
        this.dimensions.height + this.insetBounds.top + this.insetBounds.bottom,
    };
  }

  calculateDimensions(childLayout: BlockLayout | InlineLayout) {
    const childDimensions = childLayout.getDimensionsWithBounds();
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

  shouldMakeRenderElement() {
    return this.node.styleProps && this.node.styleProps.backgroundColor;
  }

  makeRenderElement() {
    return {
      box: {
        style: makeBlockStyle(this.node.styleProps),
        ...this.placement,
        ...this.getOwnDimensions(),
      },
    };
  }

  getJsonTree() {
    return {
      type: BlockLayout.name,
      dimensions: this.getOwnDimensions(),
      placement: this.placement,
      children: this.children.map((child: BlockLayout | InlineLayout) =>
        child.getJsonTree()
      ),
    };
  }
}
