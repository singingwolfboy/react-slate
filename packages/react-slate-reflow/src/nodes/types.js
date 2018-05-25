/* @flow */

import Text from './Text';
import Node from './Node';
import Root from './Root';

export type Child = Node | Text;
export type Parent = Root | Node;

export type LayoutProps = {
  marginLeft: ?number,
  marginRight: ?number,
  marginTop: ?number,
  marginBottom: ?number,
  paddingLeft: ?number,
  paddingRight: ?number,
  paddingTop: ?number,
  paddingBottom: ?number,
  display: 'block' | 'inline',
};

export type BoxStyle = {
  backgroundColor: ?string,
};

export type BodyStyle = {
  color: ?string,
  fontWeight: ?string,
  fontStyle: ?string,
  textDecoration: ?string,
  textTransform: ?('none' | 'capitalize' | 'uppercase' | 'lowercase'),
};

export type StyleProps = BoxStyle & BodyStyle;

export type BorderProps = {
  thickness: 'single-line' | 'double-line',
  color: ?string,
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

export type LayoutElement = {
  boxes: Box[],
  body: Body,
};
