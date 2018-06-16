/* @flow */

import { Stack } from 'buckets-js';
import Root from '../nodes/Root';
import Node from '../nodes/Node';
import Text from '../nodes/Text';
import RootLayout from './RootLayout';
import BlockLayout from './BlockLayout';
import InlineLayout from './InlineLayout';

import type { RenderElement } from '../types';

export default function calculateLayout(
  root: Root
): { elements: RenderElement[], layoutTree: RootLayout } {
  // const size = root.size;
  const elements = [];
  const layoutState = new Stack();

  const visit = node => {
    const parentLayout = layoutState.peek();

    if (node instanceof Node) {
      const currentLayout = new BlockLayout(node, parentLayout);
      currentLayout.calculatePlacement();

      // let persistedElement = null;
      // if (shouldMakeElementFromNode(node)) {
      //   persistedElement = makeElementFromNodeState(currentState);
      //   elements.push(persistedElement);
      // }

      layoutState.push(currentLayout);

      node.children.forEach(child => {
        const childLayout = visit(child);
        currentLayout.calculateDimensions(childLayout);
      });

      layoutState.pop();

      // If the element was created, we need to update it's height.
      // if (persistedElement) {
      //   persistedElement.box.height = height;
      // }
      return currentLayout;
    } else if (node instanceof Text) {
      const currentLayout = new InlineLayout(node, parentLayout);
      currentLayout.calculatePlacement();
      // displayState.enterInline();
      // const textLayoutState = parentLayoutState.withDisplayState(
      //   displayState,
      //   node.body
      // );
      // elements.push(textLayoutState.makeElement(node.body, null));
      // // displayState.addChildOffset(node.body.length);
      // displayState.exitInline();
      return currentLayout;
    }

    throw new Error('Unsupported node');
  };

  // Initial block layout element for Root.
  // $FlowFixMe
  const rootLayout = new RootLayout();
  layoutState.push(rootLayout);

  root.children.forEach(child => {
    rootLayout.calculateDimensions(visit(child));
  });

  return { elements, layoutTree: rootLayout };
}

// function shouldMakeElementFromNode(node: Node) {
//   return node.styleProps && node.styleProps.backgroundColor;
// }

// function makeStyle(styles, blacklist = []) {
//   const flatStyles = styles.reduce(
//     (acc, style) => ({
//       ...acc,
//       ...(style &&
//         blacklist.reduce((currentStyles, key) => {
//           const { [key]: omit, ...rest } = currentStyles;
//           return rest;
//         }, style)),
//     }),
//     {}
//   );

//   return Object.keys(flatStyles).length ? flatStyles : null;
// }
