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
    const size = this.size;
    const elements = [];
    const state = new Stack();

    const visit = (node: ChildNode) => {
      const parentState = state.peek();

      if (node instanceof Node) {
        const {
          marginTop = 0,
          marginRight = 0,
          marginBottom = 0,
          marginLeft = 0,
          paddingTop = 0,
          paddingRight = 0,
          paddingBottom = 0,
          paddingLeft = 0,
        } = normalize(node.layoutProps || {});

        const currentBox = {
          style: node.styleProps
            ? { backgroundColor: node.styleProps.backgroundColor }
            : null,
          x: parentState.box.x + marginLeft,
          y: parentState.box.y + marginTop,
          offsetX: paddingLeft,
          offsetY: paddingRight,
          width: size.width,
          shouldPersist: shouldPersistBox(node),
          refNode: node,
        };

        state.push({ box: currentBox });

        const childrenLayoutResults = node.children.map(visit);
        const {
          childrenHeight,
          childrenOffsetY,
          childrenOffsetX,
        } = combineChildrenLayout(childrenLayoutResults);

        state.pop();

        return {
          calculatedHeight: paddingTop + childrenHeight + paddingBottom,
          calculatedOffsetY: childrenOffsetY + marginBottom,
          calculatedOffsetX: childrenOffsetX + marginRight,
        };
      } else if (node instanceof Text) {
        return {
          calculatedHeight: 1,
          calculatedOffsetX: 0,
          calculatedOffsetY: 0,
        };
      }

      return {
        calculatedHeight: 0,
        calculatedOffsetY: 0,
        calculatedOffsetX: 0,
      };
    };

    state.push({
      box: {
        style: null,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        width: size.width,
        shouldPersist: false,
        refNode: null,
      },
    });

    const results = this.children.map(visit);
    const height = results.reduce(
      (acc, { calculatedHeight, calculatedOffsetY }) =>
        acc + calculatedHeight + calculatedOffsetY,
      0
    );
    console.log(height);

    return elements;
  }
}

function normalize(obj): { [key: string]: * } {
  return Object.keys(obj)
    .filter(key => typeof obj[key] !== 'undefined' || obj[key] !== null)
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

function shouldPersistBox(node: Node) {
  return (
    node.styleProps &&
    node.styleProps.backgroundColor &&
    node.layoutProps &&
    (node.layoutProps.paddingTop ||
      node.layoutProps.paddingRight ||
      node.layoutProps.paddingBottom ||
      node.layoutProps.paddingLeft)
  );
}

function combineChildrenLayout(childrenResults) {
  return childrenResults.reduce(
    (acc, { calculatedHeight, calculatedOffsetX, calculatedOffsetY }) => ({
      childrenHeight: acc.childrenHeight + calculatedHeight,
      childrenOffsetX: acc.childrenOffsetX + calculatedOffsetX,
      childrenOffsetY: acc.childrenOffsetY + calculatedOffsetY,
    }),
    { childrenHeight: 0, childrenOffsetX: 0, childrenOffsetY: 0 }
  );
}
