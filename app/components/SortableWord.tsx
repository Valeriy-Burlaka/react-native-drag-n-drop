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

import { calculateLayout, lastOrder, Offset, reorder } from "./Layout";
import Placeholder, {
  MARGIN_TOP as PLACEHOLDER_TOP_MARGIN,
  MARGIN_LEFT as PLACEHOLDER_LEFT_MARGIN,
} from "./Placeholder";

interface SortableWordProps {
  offset: Offset;
  children: ReactElement<{ id: number }>;
  containerWidth: number;
}

export const SortableWord = ({
  offset,
  children,
  containerWidth,
}: SortableWordProps) => {
  const isGestureActive = useSharedValue(false);
  const translation = useVector();
  const isInBank = useDerivedValue(() => offset.order.value === -1);
  const originalX = useDerivedValue(() => offset.originalX.value - PLACEHOLDER_LEFT_MARGIN);
  const originalY = useDerivedValue(() => offset.originalY.value + PLACEHOLDER_TOP_MARGIN);

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
    },
  });

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }
    if (isInBank.value) {
      return originalX.value;
    }
    return offset.x.value;
  });
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }
    if (isInBank.value) {
      return originalY.value;
    }
    return offset.y.value;
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
      zIndex: isGestureActive.value ? 100 : 0,
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
