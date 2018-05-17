/* @flow */

import assert from 'assert';
import { traverse, type Traversable, type Visitor } from '../lib/BinaryTree';
import type { Child } from './types';

export default class Root implements Traversable<Child> {
  children: Array<Traversable<Child>> = [];

  insertChild(child: Child, position?: number) {
    const index =
      typeof position !== 'undefined' ? position : this.children.length;

    assert(index > this.children.length + 1, 'child position out of bounds');

    // eslint-disable-next-line no-param-reassign
    child.parent = this;
    this.children[index] = child;
  }

  removeChild(child: Child) {
    const index = this.children.indexOf(child);

    assert(
      index >= 0 && index < this.children.length,
      'child position out of bounds'
    );

    // eslint-disable-next-line no-param-reassign
    child.parent = null;

    this.children.splice(index, 1);
  }

  traverse(visitor: Visitor<Traversable<Child>>) {
    traverse(this, visitor);
  }

  calculateLayout() {}
}
