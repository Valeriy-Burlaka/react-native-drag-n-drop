import { move } from "react-native-redash";

import { type SharedValues } from "types/AnimatedHelpers";

export type Offset = SharedValues<{
  order: number;
  width: number;
  height: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
}>;

function notInWordBank(offset: Offset) {
  "worklet";
  return offset.order.value !== -1;
}

function byOrder(a: Offset, b: Offset) {
  "worklet";
  return a.order.value > b.order.value ? 1 : -1;
}

export function reorderWords(allWords: Offset[], fromPosition: number, toPosition: number) {
  "worklet";
  const positionedWords = allWords.filter(notInWordBank).sort(byOrder);
  const repositioned = move(positionedWords, fromPosition, toPosition);
  repositioned.forEach((word, index) => {
    word.order.value = index;
  });
}

export function calculateLayout(allWords: Offset[], containerWidth: number) {
  "worklet";
  const positionedWords = allWords.filter(notInWordBank).sort(byOrder);
  if (positionedWords.length === 0) return;

  const lineHeight = positionedWords[0].height.value; // all elements have the same height
  let lineNumber = 0;
  let lineBreak = 0;

  positionedWords.forEach(( word, index ) => {
    const totalLineWidthWithoutThisWord = positionedWords
      .slice(lineBreak, index)
      .reduce((acc, element) => acc + element.width.value, 0);
    if (totalLineWidthWithoutThisWord + word.width.value > containerWidth ) {
      lineNumber += 1;
      lineBreak = index;
      word.x.value = 0;
    } else {
      word.x.value = totalLineWidthWithoutThisWord;
    }
    word.y.value = lineHeight * lineNumber;
  })
}
