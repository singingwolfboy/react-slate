/* @flow */

// import getCodeForStyle from './ansi/getCodeForStyle';

type Transform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';

type ContentNode = {
  type: 'content',
  value: string,
  transform: Transform,
};

type Subject =
  | 'color'
  | 'backgroundColor'
  | 'fontWeight'
  | 'fontStyle'
  | 'textDecoration';

type CodeNode = {
  type: 'code',
  subject: Subject,
  value: string,
  nodes: Array<CodeNode | ContentNode>,
};

type Style = {
  color: ?string,
  backgroundColor: ?string,
  fontWeight: ?string,
  fontStyle: ?string,
  textDecoration: ?string,
};

export default class Fragment {
  root: CodeNode | ContentNode;

  constructor(buildParams?: {
    content: string,
    transform: Transform,
    style: Style,
  }) {
    if (!buildParams) {
      return;
    }

    const { content, transform, style } = buildParams;

    // Assume content node is the root.
    let root = {
      type: 'content',
      value: content,
      transform,
    };

    // Rewrite the root with code nodes if any.
    Object.entries(style)
      .filter(([, value]) => value)
      .forEach(([key, value]) => {
        root = {
          type: 'code',
          subject: key,
          value,
          nodes: [root],
        };
      });

    // Assign the root
    this.root = root;
  }

  /**
   * Traverse the tree with given callback function.
   * If the callback returns true the traversal will be terminated.
   *
   * https://en.wikipedia.org/wiki/Depth-first_search
   */
  traverseDFS(
    callback: (
      type: 'in' | 'out',
      node: CodeNode | ContentNode
    ) => boolean | void,
    startNode: ?(CodeNode | ContentNode) = null
  ) {
    if (!startNode) {
      // eslint-disable-next-line no-param-reassign
      startNode = this.root;
    }

    if (callback('in', startNode)) {
      return true;
    }

    // Only code nodes can have children
    if (startNode.type === 'code') {
      startNode.nodes.some(node => this.traverseDFS(callback, node));
    }

    return callback('out', startNode);
  }

  getContentLength(): number {
    let length = 0;

    this.traverseDFS((visitingState, node) => {
      if (visitingState === 'in' && node.type === 'content') {
        length += node.value.length;
      }
    });

    return length;
  }

  slice(start: number, end?: number) {
    // TODO: support negative `start`
    let sliced = 0;
    const isDone = () => Math.abs(start - (end || 0)) === sliced;
    let root = null;

    this.traverseDFS((visitingState, node) => {
      if (visitingState === 'in' && node.type === 'content' && !isDone()) {
        const value = node.value.slice(
          sliced > 0 ? 0 : start,
          sliced > 0 ? end - (sliced + start) : end
        );
        sliced = value.length;
        if (!root) {
          root = [
            {
              ...node,
              value,
            },
          ];
        } else {
          root = [
            root,
            {
              ...node,
              value,
            },
          ];
        }
      } else if (visitingState === 'out' && node.type === 'code' && root) {
        root = {
          ...node,
          nodes: Array.isArray(root) ? root : [root],
        };
      }
    });

    const fragment = new Fragment();
    fragment.root = root;
    return fragment;
  }

  // merge() {}

  // toString() {}
}
