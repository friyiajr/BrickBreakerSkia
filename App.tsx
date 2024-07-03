import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import {
  BRICK_HEIGHT,
  BRICK_WIDTH,
  LIME_GREEN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  height,
} from "./constants";
import { animate, createBouncingExample, radius } from "./sample";
import { BrickInterface, CircleInterface, PaddleInterface } from "./types";

interface Props {
  idx: number;
  brick: BrickInterface;
}

const Brick = ({ idx, brick }: Props) => {
  const color = useDerivedValue(() => {
    return brick.canCollide.value ? "orange" : "transparent";
  }, [brick.canCollide]);

  return (
    <Rect
      key={idx}
      x={brick.x}
      y={brick.y}
      width={brick.width}
      height={brick.height}
      color={color}
    />
  );
};

export default function App() {
  const circleObject: CircleInterface = {
    type: "Circle",
    id: 0,
    x: useSharedValue(0),
    y: useSharedValue(0),
    r: radius,
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
  };

  const rectangleObject: PaddleInterface = {
    type: "Paddle",
    id: 0,
    x: useSharedValue(100),
    y: useSharedValue(height - 50),
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    height: PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
  };

  const bricks: BrickInterface[] = [
    {
      type: "Brick",
      id: 0,
      x: useSharedValue(20),
      y: useSharedValue(75),
      m: 0,
      ax: 0,
      ay: 0,
      vx: 0,
      vy: 0,
      height: BRICK_HEIGHT,
      width: BRICK_WIDTH,
      canCollide: useSharedValue(true),
    },
    {
      type: "Brick",
      id: 0,
      x: useSharedValue(20 + BRICK_WIDTH + 10),
      y: useSharedValue(75),
      m: 0,
      ax: 0,
      ay: 0,
      vx: 0,
      vy: 0,
      height: BRICK_HEIGHT,
      width: BRICK_WIDTH,
      canCollide: useSharedValue(true),
    },
    {
      type: "Brick",
      id: 0,
      x: useSharedValue(20 + BRICK_WIDTH * 2 + 20),
      y: useSharedValue(75),
      m: 0,
      ax: 0,
      ay: 0,
      vx: 0,
      vy: 0,
      height: BRICK_HEIGHT,
      width: BRICK_WIDTH,
      canCollide: useSharedValue(true),
    },
  ];

  createBouncingExample(circleObject);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    animate(
      [circleObject, rectangleObject, ...bricks],
      frameInfo.timeSincePreviousFrame
    );
  });

  const gesture = Gesture.Pan().onChange(({ x }) => {
    rectangleObject.x.value = x;
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <Canvas style={{ flex: 1 }}>
            <Circle
              cx={circleObject.x}
              cy={circleObject.y}
              r={radius}
              color={LIME_GREEN}
            />
            <Rect
              x={rectangleObject.x}
              y={rectangleObject.y}
              width={rectangleObject.width}
              height={rectangleObject.height}
              color={"white"}
            />
            {bricks.map((brick, idx) => {
              return <Brick key={idx} idx={idx} brick={brick} />;
            })}
          </Canvas>
        </View>
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
