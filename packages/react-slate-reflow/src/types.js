/* @flow */

import Text from './nodes/Text';
import Node from './nodes/Node';
import Root from './nodes/Root';

export interface Traversable<T> {
  children: Array<Traversable<T>>;
}

export type Child = Node | Text;
export type Parent = Root | Node;

export type LayoutProps = {
  marginLeft?: number,
  marginRight?: number,
  marginTop?: number,
  marginBottom?: number,
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  paddingBottom?: number,
  display?: 'block' | 'inline',
};

export type Bounds = {
  top: number,
  right: number,
  bottom: number,
  left: number,
};

export type BoxStyle = {
  backgroundColor?: string,
};

export type BodyStyle = {
  color?: string,
  fontWeight?: string,
  fontStyle?: string,
  textDecoration?: string,
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase',
};

export type StyleProps = BoxStyle & BodyStyle;

export type BorderProps = {
  thickness: 'single-line' | 'double-line',
  color?: string,
};

export type Box = {
  style: ?BoxStyle,
  x: number,
  y: number,
  width: number,
  height: number,
};

export type Body = {
  value: string,
  x: number,
  y: number,
  style: ?BodyStyle,
};

export type RenderElement = {
  box?: Box,
  body?: Body,
};

export interface LayoutBuilder {
  calculatePlacement(): void;
  getDimensionsWithBounds(): Dimensions;
  getJsonTree(): Object;
}

export type Placement = {
  x: number,
  y: number,
};

export type Dimensions = {
  width: number,
  height: number,
};
