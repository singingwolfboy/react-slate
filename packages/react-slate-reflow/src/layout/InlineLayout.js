/* @flow */

import BlockLayout from './BlockLayout';
import Text from '../nodes/Text';
import { makeInlineStyle } from './makeStyle';
import type { LayoutBuilder, Placement, Dimensions, BodyStyle } from '../types';

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

  makeRenderElement() {
    return {
      body: {
        value: this.node.body,
        style: makeInlineStyle(collectStyleProps(this)),
        ...this.placement,
      },
    };
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

function collectStyleProps(layout: InlineLayout) {
  const styleProps = [];
  let currentLayout = layout.parentLayout;
  while (currentLayout && currentLayout.node) {
    if (currentLayout.node.styleProps) {
      const {
        backgroundColor,
        ...inlineStyleProps
      } = currentLayout.node.styleProps;
      styleProps.push((inlineStyleProps: BodyStyle));
    }
    currentLayout = currentLayout.parentLayout;
  }
  return styleProps.reverse();
}
