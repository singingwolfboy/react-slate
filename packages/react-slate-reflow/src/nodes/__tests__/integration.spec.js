import Root from '../Root';
import Node from '../Node';
import Text from '../Text';

describe('nodes integration suite', () => {
  it('should calculate layout', () => {
    const root = new Root({ width: 20, height: 10 });

    const node1 = new Node();
    const node11 = new Text();
    node11.setBody('Hello World');
    node1.insertChild(node11);
    node1.setLayoutProps({
      marginLeft: 2,
      marginRight: 2,
      marginBottom: 1,
    });

    const node2 = new Node();
    const node21 = new Node();
    const node211 = new Text();
    node211.setBody('react-slate');
    node21.insertChild(node211);
    node21.setStyleProps({ backgroundColor: 'ansi-red' });
    node2.insertChild(node21);
    node2.setLayoutProps({
      paddingTop: 1,
      paddingBottom: 1,
    });

    const node3 = new Text();
    node3.setBody('Lorem ipsum');

    root.insertChild(node1);
    root.insertChild(node2);
    root.insertChild(node3);

    debugger // eslint-disable-line

    const elements = root.calculateLayout();

    expect(elements).toEqual([
      {
        body: {
          value: 'Hello World',
          x: 0,
          y: 0,
        },
        styleProps: null,
        x: 2,
        y: 0,
        width: 11,
        height: 1,
      },
      {
        body: {
          value: 'react-slate',
          x: 0,
          y: 1,
        },
        styleProps: { backgroundColor: 'ansi-red' },
        x: 0,
        y: 2,
        width: 11,
        height: 3,
      },
      {
        body: {
          value: 'Lorem ipsum',
          x: 0,
          y: 0,
        },
        styleProps: null,
        x: 12,
        y: 4,
        width: 11,
        height: 1,
      },
    ]);
  });
});
