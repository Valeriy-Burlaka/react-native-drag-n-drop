import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import {
  GestureEvent,
  PanGestureHandler,
  type PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { between, useVector } from "react-native-redash";

import {
  calculateLayout,
  lastPositionInSentence,
  recalculateWordOrder,
  type Offset,
} from "./Layout";
import Placeholder, {
  MARGIN_TOP as PLACEHOLDER_TOP_MARGIN,
  MARGIN_LEFT as PLACEHOLDER_LEFT_MARGIN,
} from "./Placeholder";

interface SortableWordProps {
  offsets: Offset[];
  index: number;
  children: ReactElement<{ id: number }>;
  containerWidth: number;
}

export const SortableWord = ({
  offsets,
  index,
  children,
  containerWidth,
}: SortableWordProps) => {
  const offset = offsets[index] as Offset;
  const isGestureActive = useSharedValue(false);
  const isAnimatedTransitionActiveX = useSharedValue(false);
  const isAnimatedTransitionActiveY = useSharedValue(false);

  const translation = useVector();
  const isInBank = useDerivedValue(() => offset.order.value === -1);
  const originalX = useDerivedValue(() => offset.originalX.value - PLACEHOLDER_LEFT_MARGIN);
  const originalY = useDerivedValue(() => offset.originalY.value + PLACEHOLDER_TOP_MARGIN);
  // console.log(originalY.value, offset.height.value)

  const onGestureEvent = useAnimatedGestureHandler<
    GestureEvent<PanGestureHandlerEventPayload>,
    { x: number, y: number }
  >({
    onStart: (_event, ctx) => {
      if (isInBank.value) {
        translation.x.value = originalX.value;
        translation.y.value = originalY.value;
      } else {
        translation.x.value = offset.x.value;
        translation.y.value = offset.y.value;
      }

      ctx.x = translation.x.value;
      ctx.y = translation.y.value;
      isGestureActive.value = true;
    },
    onEnd: () => {
      isGestureActive.value = false;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      translation.x.value = ctx.x + translationX;
      translation.y.value = ctx.y + translationY;

      // We drag the words up in the `WordList` container, hence the drag event's `translationY` value decreases.
      // When `translation.y.value`, which is a derivation of `originalY + translationY`, is < 100, it means
      // that we dragged the word ~halfway through the parent container's (WordList) height.
      // This means that the dragged element is somewhere around a sentence's zone, so we drop it into the sentence.
      if (isInBank.value && translation.y.value < 100) {
        offset.order.value = lastPositionInSentence(offsets);
        calculateLayout(offsets, containerWidth);
      // Move the word back to the bank if we dragged it far enough from the sentence.
      } else if (!isInBank.value && translation.y.value > 100) {
        offset.order.value = -1;
        calculateLayout(offsets, containerWidth);
        // Need to asign new order values to all words in the sentence because we've just removed a word
        recalculateWordOrder(offsets); // Don't confuse with the WorLd order.
      }
    },
  });

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    } else {
      isAnimatedTransitionActiveX.value = true;
      return withSpring(
        isInBank.value ? originalX.value : offset.x.value,
        {
          damping: 30,
          stiffness: 200,
        },
        () => (isAnimatedTransitionActiveX.value = false),
      );
    }
  });
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    } else {
      isAnimatedTransitionActiveY.value = true;
      return withSpring(
        isInBank.value ? originalY.value : offset.y.value,
        {
          damping: 30,
          stiffness: 200,
        },
        () => (isAnimatedTransitionActiveY.value = false),
      );
    }
  });

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: offset?.width.value,
      height: offset?.height.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      zIndex: isGestureActive.value || isAnimatedTransitionActiveX.value || isAnimatedTransitionActiveY.value ? 100 : 0,
    };
  });

  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={style}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};
