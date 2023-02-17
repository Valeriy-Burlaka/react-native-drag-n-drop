import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { between, useVector } from "react-native-redash";

import { calculateLayout, lastOrder, Offset, reorder } from "./Layout";
import Placeholder, {
  MARGIN_TOP as PLACEHOLDER_TOP_MARGIN,
  MARGIN_LEFT as PLACEHOLDER_LEFT_MARGIN,
} from "./Placeholder";

interface SortableWordProps {
  offsets: Offset[];
  children: ReactElement<{ id: number }>;
  index: number;
  containerWidth: number;
}

export const SortableWord = ({
  offsets,
  index,
  children,
  containerWidth,
}: SortableWordProps) => {
  const offset = offsets[index];
  const isInBank = useDerivedValue(() => offset?.order.value === -1);
  const translateX = useDerivedValue(() => {
    return isInBank.value ? offset?.originalX.value - PLACEHOLDER_LEFT_MARGIN : offset?.x.value;
  });
  const translateY = useDerivedValue(() => {
    return isInBank.value ? offset?.originalY.value + PLACEHOLDER_TOP_MARGIN : offset?.y.value;
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
      ]
    };
  });
  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={style}>
        <Animated.View style={StyleSheet.absoluteFill}>
          {children}
        </Animated.View>
      </Animated.View>
    </>
  );
};
