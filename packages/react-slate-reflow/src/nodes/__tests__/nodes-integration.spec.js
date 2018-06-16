import Root from '../Root';
import Node from '../Node';
import Text from '../Text';

function inspect(layoutTree) {
  console.log(
    require('util').inspect(
      layoutTree.getJsonTree(),
      false,
      Number.MAX_VALUE,
      true
    )
  );
}

describe('nodes integration suite', () => {
  describe('should calculate layout', () => {
    describe('for node -> text', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const node = new Node();
        const text = new Text();

        text.setBody('Hello World');
        node.insertChild(text);
        root.insertChild(node);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Hello World',
        //       style: null,
        //     },
        //   },
        // ]);
      });

      it('with layout props', () => {
        const root = getTree();

        root.children[0].setLayoutProps({
          marginLeft: 2,
          marginTop: 1,
          paddingTop: 1,
          paddingLeft: 2,
          paddingRight: 2,
          paddingBottom: 1,
        });

        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
      });
    });

    describe('for node -> node -> text', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const outerNode = new Node();
        const innerNode = new Node();
        const text = new Text();

        text.setBody('Hello World');
        innerNode.insertChild(text);
        outerNode.insertChild(innerNode);
        root.insertChild(outerNode);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Hello World',
        //       style: null,
        //     },
        //   },
        // ]);
      });

      it('with layout props', () => {
        const root = getTree();

        root.children[0].setLayoutProps({
          paddingTop: 1,
          paddingLeft: 1,
        });

        root.children[0].children[0].setLayoutProps({
          paddingTop: 1,
          marginLeft: 2,
          marginRight: 2,
        });

        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
      });
    });

    describe('for node -> [text, text]', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const node = new Node();
        const text1 = new Text();
        const text2 = new Text();

        text1.setBody('Hello');
        text2.setBody(' World');
        node.insertChild(text1);
        node.insertChild(text2);
        root.insertChild(node);

        return root;
      }

      xit('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Hello',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 5,
        //       y: 0,
        //       value: ' World',
        //       style: null,
        //     },
        //   },
        // ]);
      });

      it('with layout props', () => {
        const root = getTree();

        root.children[0].setLayoutProps({
          marginLeft: 2,
          marginTop: 2,
          paddingTop: 1,
          paddingRight: 1,
          paddingBottom: 1,
          paddingLeft: 1,
        });

        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
      });
    });

    describe('for node -> [text, node -> text]', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const outerNode = new Node();
        const text = new Text();
        const innerNode = new Node();
        const innerText = new Text();

        text.setBody('Hello');
        innerText.setBody('World');
        innerNode.insertChild(innerText);
        outerNode.insertChild(text);
        outerNode.insertChild(innerNode);
        root.insertChild(outerNode);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Hello',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 0,
        //       y: 1,
        //       value: 'World',
        //       style: null,
        //     },
        //   },
        // ]);
      });

      it('with layout props', () => {
        const root = getTree();

        root.children[0].setLayoutProps({
          paddingTop: 1,
          paddingBottom: 1,
        });

        root.children[0].children[1].setLayoutProps({
          marginLeft: 1,
          marginTop: 1,
          marginRight: 1,
          marginBottom: 1,
        });

        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
      });
    });

    describe('for node -> [node -> text, text]', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const outerNode = new Node();
        const text = new Text();
        const innerNode = new Node();
        const innerText = new Text();

        text.setBody('World');
        innerText.setBody('Hello');
        innerNode.insertChild(innerText);
        outerNode.insertChild(innerNode);
        outerNode.insertChild(text);
        root.insertChild(outerNode);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Hello',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 0,
        //       y: 1,
        //       value: 'World',
        //       style: null,
        //     },
        //   },
        // ]);
      });

      it('with layout props', () => {
        const root = getTree();

        root.children[0].setLayoutProps({
          paddingTop: 1,
          paddingBottom: 1,
        });

        root.children[0].children[0].setLayoutProps({
          marginLeft: 1,
          marginTop: 1,
          marginRight: 1,
          marginBottom: 1,
        });

        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
      });
    });

    describe('for node -> [node -> text, node -> text]', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const outerNode = new Node();
        const innerNode1 = new Node();
        const text1 = new Text();
        const innerNode2 = new Node();
        const text2 = new Text();

        text1.setBody('Hello');
        text2.setBody('World');
        innerNode1.insertChild(text1);
        innerNode2.insertChild(text2);
        outerNode.insertChild(innerNode1);
        outerNode.insertChild(innerNode2);
        root.insertChild(outerNode);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Hello',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 0,
        //       y: 1,
        //       value: 'World',
        //       style: null,
        //     },
        //   },
        // ]);
      });
    });

    describe('for node -> [text, node -> text, text]', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const outerNode = new Node();
        const innerNode = new Node();
        const text1 = new Text();
        const text2 = new Text();
        const text3 = new Text();

        text1.setBody('Brave');
        text2.setBody('New');
        text3.setBody('World');
        innerNode.insertChild(text2);
        outerNode.insertChild(text1);
        outerNode.insertChild(innerNode);
        outerNode.insertChild(text3);
        root.insertChild(outerNode);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Brave',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 0,
        //       y: 1,
        //       value: 'New',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 0,
        //       y: 2,
        //       value: 'World',
        //       style: null,
        //     },
        //   },
        // ]);
      });
    });

    describe('for node -> [node -> text, text, node -> text]', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const outerNode = new Node();
        const innerNode1 = new Node();
        const innerNode2 = new Node();
        const text1 = new Text();
        const text2 = new Text();
        const text3 = new Text();

        text1.setBody('Brave');
        text2.setBody('New');
        text3.setBody('World');
        innerNode1.insertChild(text1);
        innerNode2.insertChild(text3);
        outerNode.insertChild(innerNode1);
        outerNode.insertChild(text2);
        outerNode.insertChild(innerNode2);
        root.insertChild(outerNode);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
        // expect(elements).toEqual([
        //   {
        //     body: {
        //       x: 0,
        //       y: 0,
        //       value: 'Brave',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 0,
        //       y: 1,
        //       value: 'New',
        //       style: null,
        //     },
        //   },
        //   {
        //     body: {
        //       x: 0,
        //       y: 2,
        //       value: 'World',
        //       style: null,
        //     },
        //   },
        // ]);
      });
    });

    describe('for node -> [node -> text, text, node -> [text, text]]', () => {
      function getTree() {
        const root = new Root({ width: 20, height: 10 });
        const outerNode = new Node();

        const node1 = new Node();
        const text1 = new Text();
        node1.insertChild(text1);
        text1.setBody('Text1');

        const text2 = new Text();
        text2.setBody('Text2');

        const node2 = new Node();
        const text3 = new Text();
        const text4 = new Text();
        text3.setBody('Text3');
        text4.setBody('Text4');
        node2.insertChild(text3);
        node2.insertChild(text4);

        outerNode.insertChild(node1);
        outerNode.insertChild(text2);
        outerNode.insertChild(node2);

        root.insertChild(outerNode);

        return root;
      }

      it('without style/layout props', () => {
        const root = getTree();
        const { layoutTree } = root.calculateLayout();
        expect(layoutTree.getJsonTree()).toMatchSnapshot();
      });
    });
  });

  xit('node -> [node (bg) -> text, node -> text]', () => {
    const root = new Root({ width: 20, height: 10 });
    const parentNode = new Node();

    const node1 = new Node();
    const text1 = new Text();
    text1.setBody('Hello');
    node1.insertChild(text1);
    node1.setLayoutProps({
      marginLeft: 2,
      paddingBottom: 1,
      paddingTop: 1,
    });
    node1.setStyleProps({ backgroundColor: 'red' });

    const node2 = new Node();
    const text2 = new Text();
    text2.setBody('World');
    node2.insertChild(text2);
    node2.setLayoutProps({
      marginTop: 2,
    });

    parentNode.insertChild(node1);
    parentNode.insertChild(node2);
    root.insertChild(parentNode);

      debugger // eslint-disable-line
    const { elements } = root.calculateLayout();

    expect(elements).toEqual([
      {
        box: {
          style: {
            backgroundColor: 'red',
          },
          x: 2,
          y: 0,
          width: 20,
          height: 3,
        },
      },
      {
        body: {
          x: 2,
          y: 1,
          value: 'Hello',
          style: null,
        },
      },
      {
        body: {
          x: 0,
          y: 5,
          value: 'World',
          style: null,
        },
      },
    ]);
  });
});
