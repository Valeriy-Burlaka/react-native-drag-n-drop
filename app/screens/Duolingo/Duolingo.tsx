import React from "react";
import { View, StyleSheet } from "react-native";

import { WordList } from "components/WordList";
import { Word } from 'components/Word';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

const words = [
  { id: 1, word: "She" },
  { id: 8, word: "hungry" },
  { id: 2, word: "eats" },
  { id: 7, word: "she" },
  { id: 6, word: "because" },
  { id: 9, word: "is" },
  { id: 5, word: "very" },
  { id: 3, word: "an" },
  { id: 4, word: "apple" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export const Duolingo = () => {
  return (
    <View style={styles.container}>
      <Header />
      <WordList>
        {words.map((word) => (
          <Word key={word.id} {...word} />
        ))}
      </WordList>
      <Footer />
    </View>
  );
};
