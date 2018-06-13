/* @flow */

import type { Parent } from '../types';
import type { Traversable } from '../lib/BinaryTree';

export default class Text implements Traversable<*> {
  body: string = '';
  parent: ?Parent = null;
  // Children should always be empty.
  children: Array<*> = Object.freeze([]);

  setBody(body: string) {
    this.body = body;
  }
}
