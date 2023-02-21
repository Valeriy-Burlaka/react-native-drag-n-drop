/* eslint-disable react-hooks/rules-of-hooks */
import React, { ReactElement, useState } from "react";
import { View, StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import { useSharedValue, runOnUI, runOnJS } from "react-native-reanimated";

import { SortableWord } from "./SortableWord";
import Lines from "./Lines";

import { calculateLayout } from "./Layout";

const margin = 32;
const containerWidth = Dimensions.get("window").width - margin * 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

interface WordListProps {
  children: ReactElement<{ id: number }>[];
}

export const WordList = ({ children }: WordListProps) => {
  const [ready, setReady] = useState(false);
  
  const offsets = children.map(() => ({
    order: useSharedValue(0), // dynamic, -1 if a word isn't dragged into the sentence
    width: useSharedValue(0), // static
    height: useSharedValue(0),  // static
    x: useSharedValue(0), // dynamic
    y: useSharedValue(0), // dynamic
    originalX: useSharedValue(0), // static
    originalY: useSharedValue(0), // static
  }));


  if (!ready) {
    return (
      <View style={styles.row}>
        {children.map((child, index) => {
          return (
            <View
              key={index}
              onLayout={({
                nativeEvent: {
                  layout: { x, y, width, height },
                },
              }) => {
                const offset = offsets[index];

                offset.order.value = -1;
                offset.width.value = width;
                offset.height.value = height;
                offset.originalX.value = x;
                offset.originalY.value = y;

                runOnUI(() => {
                  "worklet";
                  if (offsets.every(o => o.order.value === -1)) {
                    calculateLayout(offsets, containerWidth);
                    runOnJS(setReady)(true);
                  }
                })();
              }}
            >
              {child}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Lines />
      {children.map((child, index) => (
        <SortableWord
          key={index}
          offset={offsets[index]}
          containerWidth={containerWidth}
        >
          {child}
        </SortableWord>
      ))}
    </View>
  );
};
