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
import Placeholder, { MARGIN_TOP, MARGIN_LEFT } from "./Placeholder";

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
  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: offset.width.value,
      height: offset.height.value,
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
