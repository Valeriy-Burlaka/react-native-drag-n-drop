import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Cross from "./svg/Cross";
import Heart from "./svg/Heart";
import Progress from "./svg/Progress";
import { Character } from "./Character";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 24,
    paddingLeft: 16,
    marginBottom: 16,
  },
});

export const Header = () => {
  return (
    <View>
      <View style={styles.row}>
        <Cross />
        <Progress />
        <Heart />
      </View>
      <Text style={styles.title}>Translate this sentence</Text>
      <Character />
    </View>
  );
};
