/* @flow */

import type { LayoutProps, Bounds } from '../types';

export default function normalizeLayoutProps(
  layoutProps: LayoutProps
): { insetBounds: Bounds, outsetBounds: Bounds } {
  return {
    insetBounds: {
      top: Math.max(layoutProps.paddingTop || 0, 0),
      right: Math.max(layoutProps.paddingRight || 0, 0),
      bottom: Math.max(layoutProps.paddingBottom || 0, 0),
      left: Math.max(layoutProps.paddingLeft || 0, 0),
    },
    outsetBounds: {
      top: Math.max(layoutProps.marginTop || 0, 0),
      right: Math.max(layoutProps.marginRight || 0, 0),
      bottom: Math.max(layoutProps.marginBottom || 0, 0),
      left: Math.max(layoutProps.marginLeft || 0, 0),
    },
  };
}
