import { Canvas } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1 }}></Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  titleContainer: {
    flexDirection: "row",
  },
  titleTextNormal: {
    color: "white",
    fontSize: 40,
  },
  titleTextBold: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
});
