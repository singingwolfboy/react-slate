/* @flow */

import { Node } from './BinaryTree';

type Transform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';
type Subject =
  | 'color'
  | 'backgroundColor'
  | 'fontWeight'
  | 'fontStyle'
  | 'textDecoration';
type Style = {
  color: ?string,
  backgroundColor: ?string,
  fontWeight: ?string,
  fontStyle: ?string,
  textDecoration: ?string,
};

export class ContentNode extends Node {
  type = 'content';
  transform: Transform;
  value: string;

  constructor({ value, transform }: { value: string, transform: Transform }) {
    super();
    this.value = value;
    this.transform = transform;
  }
}

export class CodeNode extends Node {
  type = 'code';
  subject: Subject;
  value: string;

  constructor({ value, subject }: { value: string, subject: Subject }) {
    super();
    this.value = value;
    this.subject = subject;
  }
}

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
    let root = new ContentNode({
      value: content,
      transform,
    });

    // Rewrite the root with code nodes if any.
    Object.entries(style)
      .filter(([, value]) => value)
      .forEach(([key, value]: [any, any]) => {
        const newRoot = new CodeNode({
          subject: key,
          value,
        });
        newRoot.children = [root];
        root = newRoot;
      });

    // Assign the root
    this.root = root;
  }

  getContentLength(): number {
    let length = 0;
    this.root.traverse({
      enter(node) {
        if (node instanceof ContentNode) {
          length += node.value.length;
        }
      },
    });
    return length;
  }

  slice(start: number, end?: number) {
    // TODO: support negative `start`
    let sliced = 0;
    const isDone = () => Math.abs(start - (end || 0)) === sliced;
    let root = null;

    this.root.traverse({
      enter(node) {
        if (node instanceof ContentNode && !isDone()) {
          const value = node.value.slice(
            sliced > 0 ? 0 : start,
            sliced > 0 ? end - (sliced + start) : end
          );
          sliced = value.length;
          if (!root) {
            root = new ContentNode({ ...node, value });
          } else {
            // $FlowFixMe
            root = [root, new ContentNode({ ...node, value })];
          }
        }
      },
      exit(node) {
        if (node instanceof CodeNode && root) {
          const newRoot = new CodeNode(node);
          newRoot.children = Array.isArray(root) ? root : [root];
          root = newRoot;
        }
      },
    });

    const fragment = new Fragment();
    // $FlowFixMe
    fragment.root = root;
    return fragment;
  }

  // merge() {}

  // toString() {}
}
