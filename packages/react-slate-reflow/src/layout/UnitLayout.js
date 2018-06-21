/* @flow */

import { makeInlineStyle } from './makeStyle';
import type ContainerLayout from './ContainerLayout';
import type Text from '../nodes/Text';
import type { LayoutBuilder, Placement, Dimensions } from '../types';

export default class UnitLayout implements LayoutBuilder {
  parentLayout: ContainerLayout;
  node: Text;
  placement: Placement = { x: 0, y: 0 };
  dimensions: Dimensions = { width: 0, height: 0 };

  constructor(node: Text, parentLayout: ContainerLayout) {
    this.node = node;
    this.parentLayout = parentLayout;
    parentLayout.children.push(this);
    this.dimensions.width = node.body.length;
    this.dimensions.height = 1;
  }

  calculatePlacement() {
    if (this.parentLayout.lastChildLayout instanceof UnitLayout) {
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
      type: UnitLayout.name,
      dimensions: this.dimensions,
      placement: this.placement,
      body: this.node.body,
    };
  }
}

function collectStyleProps(layout: UnitLayout) {
  const styleProps = [];
  let currentLayout = layout.parentLayout;
  while (currentLayout && currentLayout.node) {
    if (currentLayout.node.styleProps) {
      const {
        backgroundColor,
        ...inlineStyleProps
      } = currentLayout.node.styleProps;
      styleProps.push(inlineStyleProps);
    }
    currentLayout = currentLayout.parentLayout;
  }
  return styleProps.reverse();
}
