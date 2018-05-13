/* @flow */

export type Visitor = {
  enter?: Node => boolean | void,
  exit?: Node => boolean | void,
};

export class Node {
  children: Node[];
  parent: Node;

  traverse(visitor: Visitor) {
    traverseDFS(this, visitor);
  }
}

/**
 * Traverse the tree with given visitor.
 * If the visitor returns `true` the traversal will be terminated.
 *
 * https://en.wikipedia.org/wiki/Depth-first_search
 */
export function traverseDFS(root: Node, visitor: Visitor) {
  if (
    (visitor.enter && visitor.enter(root)) ||
    (root.children && root.children.some(node => traverseDFS(node, visitor)))
  ) {
    return true;
  }

  return visitor.exit && visitor.exit(root);
}
