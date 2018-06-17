/* @flow */

import Row from './Row';
import type { RenderElement, Dimensions } from '../types';

export default function render(
  elements: RenderElement[],
  canvasSize: Dimensions
) {
  const rows = new Array(canvasSize.height).fill(new Row(canvasSize.width));

  elements.forEach(element => {
    for (let i = 0; i < element.height; i++) {
      const row = rows[element.y + i];
      if (element.body) {
        row.setText({
          value: element.body.value,
          start: element.body.x,
          length: element.body.width,
          style: element.body.style,
        });
      } else if (element.box) {
        row.setStyle({
          start: element.box.x,
          length: element.box.width,
          style: element.box.style,
        });
      }
    }
  });

  return rows.map(row => row.toString()).join('\n');
}
