/* @flow */

import assert from 'assert';
import type { Traversable } from '../lib/BinaryTree';
import type {
  Child,
  Parent,
  LayoutProps,
  StyleProps,
  BorderProps,
} from './types';

export default class Node implements Traversable<Child> {
  parent: ?Parent = null;
  children: Array<Traversable<Child>> = [];

  layoutProps: ?LayoutProps = null;
  styleProps: ?StyleProps = null;
  borderProps: ?BorderProps = null;

  constructor({ parent }: { parent: Node } = {}) {
    if (parent) {
      this.parent = parent;
    }
  }

  setLayoutProps(layoutProps: ?LayoutProps) {
    this.layoutProps = layoutProps;
  }

  setStyleProps(styleProps: ?StyleProps) {
    this.styleProps = styleProps;
  }

  setBorder(borderProps: ?BorderProps) {
    this.borderProps = borderProps;
    // $FlowFixMe
    assert.fail('missing implementation');
    // TODO: transform children tree to account for border
  }

  insertChild(child: Child, position?: number) {
    const index =
      typeof position !== 'undefined' ? position : this.children.length;

    assert(
      index <= this.children.length + 1,
      `child position out of bounds: ${index}`
    );

    // eslint-disable-next-line no-param-reassign
    child.parent = this;
    this.children[index] = child;
  }

  removeChild(child: Child) {
    const index = this.children.indexOf(child);

    assert(index >= 0, 'child not found');

    // eslint-disable-next-line no-param-reassign
    child.parent = null;
    this.children.splice(index, 1);
  }
}
