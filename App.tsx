import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";

const LIME_GREEN = "#4AF626";

const { height, width } = Dimensions.get("window");
const BOTTOM = height - 120;
const PADDLE_HEIGHT = 20;
const PADDLE_Y = BOTTOM - PADDLE_HEIGHT;
const TOP = 10;

// 10 frames every 16 milliseconds
const GAME_SPEED = 10 / 16;

const FRAME_UPDATE_TIME = 16.6;

interface Point {
  x: number;
  y: number;
}

const dist = (point1: Point, point2: Point) => {
  "worklet";
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

export default function App() {
  const isDecending = useSharedValue(true);
  const paddleX = useSharedValue(100);
  const circleX = useSharedValue(100);
  const circleY = useSharedValue(0);

  const gesture = Gesture.Pan().onChange(({ x }) => {
    paddleX.value = x;
  });

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    const distance = dist(
      { x: circleX.value, y: circleY.value },
      {
        x: paddleX.value,
        y: PADDLE_Y,
      }
    );

    if (distance <= PADDLE_HEIGHT) {
      isDecending.value = false;
      circleY.value -= frameInfo.timeSincePreviousFrame * GAME_SPEED;
      return;
    }

    // This can probably be removed later.
    // You lose the game if this happens
    if (circleY.value >= BOTTOM) {
      isDecending.value = false;
    }

    if (circleY.value <= TOP) {
      isDecending.value = true;
    }

    if (isDecending.value) {
      circleY.value += frameInfo.timeSincePreviousFrame * GAME_SPEED;
    } else {
      circleY.value -= frameInfo.timeSincePreviousFrame * GAME_SPEED;
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <SafeAreaView style={styles.container}>
          <Canvas style={{ height: BOTTOM }}>
            <Circle cx={100} cy={circleY} color={LIME_GREEN} r={TOP} />
            <Rect
              x={paddleX}
              y={PADDLE_Y}
              height={PADDLE_HEIGHT}
              width={100}
              color={"white"}
            />
          </Canvas>
        </SafeAreaView>
      </GestureDetector>
    </GestureHandlerRootView>
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
