/* @flow */

import assert from 'assert';
import { traverse, type Traversable, type Visitor } from '../lib/BinaryTree';
import type { Child } from '../types';
import calculateLayout from '../layout/calculateLayout';

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

  calculateLayout() {
    return calculateLayout(this);
  }
}
