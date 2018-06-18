/* @flow */

import chalk from 'chalk';

function applySingleStyle(key: string, value: mixed, text: string) {
  switch (key) {
    case 'color':
    case 'fontWeight':
    case 'fontStyle':
      // $FlowFixMe
      return chalk[value](text);
    case 'backgroundColor':
      // $FlowFixMe
      return chalk[`bg${value[0].toUpperCase()}${value.slice(1)}`](text);
    case 'textDecoration':
      return value === 'line-through'
        ? chalk.strikethrough(text)
        : // $FlowFixMe
          chalk[value](text);
    default:
      return '';
  }
}

export default function applyStyle(
  style: { [key: string]: string },
  text: string
) {
  return chalk.reset(
    Object.keys(style).reduce(
      (output, key) => applySingleStyle(key, style[key], output),
      text
    )
  );
}
