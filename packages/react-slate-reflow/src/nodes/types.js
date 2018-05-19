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

export type StyleProps = {
  color: ?string,
  backgroundColor: ?string,
  fontWeight: ?string,
  fontStyle: ?string,
  textDecoration: ?string,
  textTransform: ?('none' | 'capitalize' | 'uppercase' | 'lowercase'),
};

export type BorderProps = {
  thickness: 'single-line' | 'double-line',
  color: ?string,
};

export type LayoutElement = {
  body: {
    value: string,
    x: number,
    y: number,
  },
  styleProps: ?StyleProps,
  x: number,
  y: number,
  width: number,
  height: number,
};
