/* @flow */

import assert from 'assert';
import { Stack } from 'buckets-js';
import { traverse, type Traversable, type Visitor } from '../lib/BinaryTree';
import type { Child, LayoutElement } from './types';
import Node from './Node';
import Text from './Text';

type Size = {
  width: number,
  height: number,
};

export default class Root implements Traversable<Child> {
  children: Array<Traversable<Child>> = [];
  size: Size;

  constructor(size: Size) {
    this.size = size;
  }

  insertChild(child: Child, position?: number) {
    const index =
      typeof position !== 'undefined' ? position : this.children.length;

    assert(index <= this.children.length + 1, 'child position out of bounds');

    // eslint-disable-next-line no-param-reassign
    child.parent = this;
    this.children[index] = child;
  }

  removeChild(child: Child) {
    const index = this.children.indexOf(child);

    assert(
      index >= 0 && index < this.children.length,
      `child position out of bounds: ${index}`
    );

    // eslint-disable-next-line no-param-reassign
    child.parent = null;

    this.children.splice(index, 1);
  }

  traverse(visitor: Visitor<Traversable<Child>>) {
    traverse(this, visitor);
  }

  calculateLayout(): LayoutElement[] {
    const elements = [];
    let accX = 0;
    let accY = 0;
    let accBodyX = 0;
    let accBodyY = 0;
    let accWidth = 0;
    let accHeight = 0;

    const stylePropsStack = new Stack();

    this.traverse({
      enter(node) {
        if (node instanceof Node) {
          // Store styleProps for later
          stylePropsStack.push(node.styleProps);

          const {
            marginTop = 0,
            marginLeft = 0,
            paddingTop = 0,
            paddingLeft = 0,
            paddingRight = 0,
            paddingBottom = 0,
          } = normalize(node.layoutProps || {});

          // Add marginLeft and marginRight before going further,
          // since it will change x and y of element.
          accX += marginLeft;
          accY += marginTop;
          if (marginTop > 0) {
            // Reset accX since it's a new line.
            accX = 0;
          }

          // Update accumulated width and height with padding values
          // as well as relative body x and y.
          accWidth += paddingLeft + paddingRight;
          accHeight += paddingTop + paddingBottom;
          accBodyX += paddingLeft;
          accBodyY += paddingTop;
        } else if (node instanceof Text) {
          const styleProps = stylePropsStack
            .toArray()
            .filter(Boolean)
            .reduce((acc, style) => ({ ...(acc || {}), ...style }), null);

          const element = {
            body: {
              value: node.body,
              x: accBodyX,
              y: accBodyY,
            },
            styleProps,
            x: accX,
            y: accY,
            width: accWidth + node.body.length,
            height: accHeight + 1,
          };

          // reset acc
          accX += element.width;

          elements.push(element);
        }
      },
      exit(node) {
        if (node instanceof Node) {
          stylePropsStack.pop();

          const {
            marginBottom = 0,
            marginRight = 0,
            paddingTop = 0,
            paddingLeft = 0,
            paddingRight = 0,
            paddingBottom = 0,
          } = normalize(node.layoutProps || {});

          const elementHeight = 1; // TODO: handle inline display
          accX += marginRight;
          accY += marginBottom + elementHeight;
          if (marginBottom + elementHeight > 0) {
            // Reset accX since it's a new line.
            accX = 0;
          }

          accWidth -= paddingLeft + paddingRight;
          accHeight -= paddingTop + paddingBottom;
          accBodyX -= paddingLeft;
          accBodyY -= paddingTop;
        }
      },
    });

    return elements;
  }
}

function normalize(obj): { [key: string]: * } {
  return Object.keys(obj)
    .filter(key => typeof obj[key] !== 'undefined' || obj[key] !== null)
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}
