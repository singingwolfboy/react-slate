/* @flow */

import styles from 'ansi-styles';

export default function getCodeForStyle(
  key: string,
  value: mixed
): ?{ open: string, close: string } {
  switch (key) {
    case 'color':
    case 'fontWeight':
    case 'fontStyle':
      return styles[value];
    case 'backgroundColor':
      // $FlowFixMe
      return styles[`bg${value[0].toUpperCase()}${value.slice(1)}`];
    case 'textDecoration':
      return value === 'line-through' ? styles.strikethrough : styles[value];
    default:
      return null;
  }
}
