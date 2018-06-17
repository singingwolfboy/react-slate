/* @flow */

import type { StyleProps } from '../types';

type Cell = {
  char: string,
  style: ?StyleProps,
};

export default class Row {
  length: number;
  cells: Cell[];

  constructor(length: number) {
    this.cells = new Array(length).fill({ char: ' ', style: null });
  }

  setText({
    start,
    length,
    style,
    value,
  }: {
    start: number,
    length: number,
    style: ?StyleProps,
    value: string,
  }) {
    for (let i = 0; i <= length; i++) {
      const cellIndex = start + i;
      this.cells[cellIndex].style = style
        ? {
            ...(this.cells[cellIndex].style || {}),
            ...style,
          }
        : this.cells[cellIndex].style;
      this.cells[cellIndex].char = value[i];
    }
  }

  setStyle({
    start,
    length,
    style,
  }: {
    start: number,
    length: number,
    style: ?StyleProps,
  }) {
    if (!style) {
      return;
    }

    for (let i = 0; i <= length; i++) {
      const cellIndex = start + i;
      this.cells[cellIndex].style = {
        ...(this.cells[cellIndex].style || {}),
        ...style,
      };
    }
  }

  toString() {
    return '';
  }
}
