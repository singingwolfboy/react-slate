/* @flow */

export type Visitor<T> = {
  enter?: T => boolean | void,
  exit?: T => boolean | void,
};

export interface Traversable<T> {
  children: Array<Traversable<T>>;
}

/**
 * Traverse the tree with given visitor.
 * If the visitor returns `true` the traversal will be terminated.
 *
 * https://en.wikipedia.org/wiki/Depth-first_search
 */
export function traverse<T>(
  root: Traversable<T>,
  visitor: Visitor<Traversable<T>>
) {
  const runHook = (fn, node) => fn && fn(node);

  if (
    runHook(visitor.enter, root) ||
    (typeof root.children !== 'undefined' &&
      Array.isArray(root.children) &&
      root.children.some(node => traverse(node, visitor)))
  ) {
    return true;
  }

  return runHook(visitor.exit, root);
}
