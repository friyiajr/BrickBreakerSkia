import {
  Canvas,
  Circle,
  LinearGradient,
  RoundedRect,
  vec,
} from "@shopify/react-native-skia";
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
  BRICK_MIDDLE,
  height,
  PADDLE_MIDDLE,
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
    <RoundedRect
      key={idx}
      x={brick.x}
      y={brick.y}
      width={brick.width}
      height={brick.height}
      color={color}
      r={8}
    >
      <LinearGradient
        start={vec(5, 200)}
        end={vec(4, 50)}
        colors={["red", "orange"]}
      />
    </RoundedRect>
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
    x: useSharedValue(PADDLE_MIDDLE),
    y: useSharedValue(height - 80),
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
      x: useSharedValue(BRICK_MIDDLE + BRICK_WIDTH + 50),
      y: useSharedValue(60),
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
      x: useSharedValue(BRICK_MIDDLE),
      y: useSharedValue(60),
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
      x: useSharedValue(BRICK_MIDDLE - BRICK_WIDTH - 50),
      y: useSharedValue(60),
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
      x: useSharedValue(BRICK_MIDDLE + BRICK_WIDTH + 50),
      y: useSharedValue(105),
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
      x: useSharedValue(BRICK_MIDDLE),
      y: useSharedValue(105),
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
      x: useSharedValue(BRICK_MIDDLE - BRICK_WIDTH - 50),
      y: useSharedValue(105),
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
      x: useSharedValue(BRICK_MIDDLE + BRICK_WIDTH + 50),
      y: useSharedValue(150),
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
      x: useSharedValue(BRICK_MIDDLE),
      y: useSharedValue(150),
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
      x: useSharedValue(BRICK_MIDDLE - BRICK_WIDTH - 50),
      y: useSharedValue(150),
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
    rectangleObject.x.value = x - PADDLE_WIDTH / 2;
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
            <RoundedRect
              x={rectangleObject.x}
              y={rectangleObject.y}
              width={rectangleObject.width}
              height={rectangleObject.height}
              color={"white"}
              r={8}
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
