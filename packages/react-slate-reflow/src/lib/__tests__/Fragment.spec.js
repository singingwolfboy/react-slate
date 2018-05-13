/* @flow */
import Fragment from '../Fragment';

describe('Fragment', () => {
  it('should crate a valid instance', () => {
    const fragment = new Fragment({
      content: 'test',
      transform: 'none',
      style: {
        color: 'red',
        backgroundColor: 'black',
        fontStyle: null,
        fontWeight: null,
        textDecoration: null,
      },
    });

    expect(fragment.getContentLength()).toBe(4);
    expect(fragment.root).toEqual({
      type: 'code',
      subject: 'backgroundColor',
      value: 'black',
      nodes: [
        {
          type: 'code',
          subject: 'color',
          value: 'red',
          nodes: [
            {
              type: 'content',
              transform: 'none',
              value: 'test',
            },
          ],
        },
      ],
    });
  });

  it('#traverseDFS should stop if callback returns true', () => {
    const fragment = new Fragment({
      content: 'test',
      transform: 'none',
      style: {
        color: 'red',
        backgroundColor: 'black',
        fontStyle: null,
        fontWeight: null,
        textDecoration: null,
      },
    });

    let calledTimes = 0;
    fragment.traverseDFS((visitingState, node) => {
      if (visitingState === 'out') {
        return false;
      }
      calledTimes++;
      if (node.type === 'code' && node.subject === 'color') {
        return true;
      }
      return false;
    });

    expect(calledTimes).toBe(2);
  });

  describe('slice method', () => {
    it('should slice single content chunk', () => {
      const fragment = new Fragment({
        content: 'test',
        transform: 'none',
        style: {
          color: 'red',
          backgroundColor: 'black',
          fontStyle: null,
          fontWeight: null,
          textDecoration: null,
        },
      });

      const slicedFragment = fragment.slice(2, 4);
      expect(slicedFragment.root).toEqual({
        type: 'code',
        subject: 'backgroundColor',
        value: 'black',
        nodes: [
          {
            type: 'code',
            subject: 'color',
            value: 'red',
            nodes: [
              {
                type: 'content',
                transform: 'none',
                value: 'st',
              },
            ],
          },
        ],
      });
    });

    it('should slice 2 content chunk', () => {
      const fragment = new Fragment({
        content: 'Hello',
        transform: 'none',
        style: {
          color: 'red',
          backgroundColor: 'black',
          fontStyle: null,
          fontWeight: null,
          textDecoration: null,
        },
      });

      fragment.root.nodes.push({
        type: 'content',
        transform: 'none',
        value: 'World',
      });

      const slicedFragment = fragment.slice(3, 7);
      expect(slicedFragment.root).toEqual({
        type: 'code',
        subject: 'backgroundColor',
        value: 'black',
        nodes: [
          {
            type: 'code',
            subject: 'color',
            value: 'red',
            nodes: [
              {
                type: 'content',
                transform: 'none',
                value: 'lo',
              },
            ],
          },
          {
            type: 'content',
            transform: 'none',
            value: 'Wo',
          },
        ],
      });
    });
  });
});
