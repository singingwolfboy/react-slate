/* @flow */

import type { StyleProps, BodyStyle } from '../types';

export function makeBlockStyle(styleProps: ?StyleProps) {
  return styleProps
    ? {
        backgroundColor: styleProps.backgroundColor,
      }
    : null;
}

export function makeInlineStyle(collectedStyleProps: BodyStyle[]) {
  return collectedStyleProps
    .filter(styleProps => Object.keys(styleProps).length)
    .reduce(
      (flatStyles, styleProps) => ({
        ...(flatStyles || {}),
        ...styleProps,
      }),
      null
    );
}
