// /* @flow */
// import Fragment, { ContentNode, CodeNode } from '../Fragment';

// function makeNodes(spec) {
//   const fragment =
//     spec.type === 'code'
//       ? new CodeNode({
//           value: spec.value,
//           subject: spec.subject,
//         })
//       : new ContentNode({ value: spec.value, transform: spec.transform });
//   if (spec.children) {
//     fragment.children = spec.children.map(makeNodes);
//   }
//   return fragment;
// }

// describe('Fragment', () => {
//   it('should crate a valid instance', () => {
//     const fragment = new Fragment({
//       content: 'test',
//       transform: 'none',
//       style: {
//         color: 'red',
//         backgroundColor: 'black',
//         fontStyle: null,
//         fontWeight: null,
//         textDecoration: null,
//       },
//     });

//     expect(fragment.getContentLength()).toBe(4);
//     expect(fragment.root).toEqual(
//       makeNodes({
//         type: 'code',
//         subject: 'backgroundColor',
//         value: 'black',
//         children: [
//           {
//             type: 'code',
//             subject: 'color',
//             value: 'red',
//             children: [
//               {
//                 type: 'content',
//                 transform: 'none',
//                 value: 'test',
//               },
//             ],
//           },
//         ],
//       })
//     );
//   });

//   describe('slice method', () => {
//     it('should slice single content chunk', () => {
//       const fragment = new Fragment({
//         content: 'test',
//         transform: 'none',
//         style: {
//           color: 'red',
//           backgroundColor: 'black',
//           fontStyle: null,
//           fontWeight: null,
//           textDecoration: null,
//         },
//       });

//       const slicedFragment = fragment.slice(2, 4);
//       expect(slicedFragment.root).toEqual(
//         makeNodes({
//           type: 'code',
//           subject: 'backgroundColor',
//           value: 'black',
//           children: [
//             {
//               type: 'code',
//               subject: 'color',
//               value: 'red',
//               children: [
//                 {
//                   type: 'content',
//                   transform: 'none',
//                   value: 'st',
//                 },
//               ],
//             },
//           ],
//         })
//       );
//     });

//     it('should slice 2 content chunk', () => {
//       const fragment = new Fragment({
//         content: 'Hello',
//         transform: 'none',
//         style: {
//           color: 'red',
//           backgroundColor: 'black',
//           fontStyle: null,
//           fontWeight: null,
//           textDecoration: null,
//         },
//       });

//       fragment.root.children.push(
//         new ContentNode({
//           transform: 'none',
//           value: 'World',
//         })
//       );

//       const slicedFragment = fragment.slice(3, 7);
//       expect(slicedFragment.root).toEqual(
//         makeNodes({
//           type: 'code',
//           subject: 'backgroundColor',
//           value: 'black',
//           children: [
//             {
//               type: 'code',
//               subject: 'color',
//               value: 'red',
//               children: [
//                 {
//                   type: 'content',
//                   transform: 'none',
//                   value: 'lo',
//                 },
//               ],
//             },
//             {
//               type: 'content',
//               transform: 'none',
//               value: 'Wo',
//             },
//           ],
//         })
//       );
//     });
//   });
// });
