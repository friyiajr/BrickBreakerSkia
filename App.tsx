import {
  Canvas,
  Circle,
  LinearGradient,
  matchFont,
  Rect,
  RoundedRect,
  Shader,
  Text,
  useClock,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
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
  BRICK_MIDDLE,
  BRICK_ROW_LENGTH,
  BRICK_WIDTH,
  height,
  BALL_COLOR,
  PADDLE_HEIGHT,
  PADDLE_MIDDLE,
  PADDLE_WIDTH,
  TOTAL_BRICKS,
  width,
  RADIUS,
} from "./constants";
import { animate, createBouncingExample } from "./sample";
import { BrickInterface, CircleInterface, PaddleInterface } from "./types";

import { shader } from "./shader";

interface Props {
  idx: number;
  brick: BrickInterface;
}

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: 55,
  fontWeight: "bold",
};

// @ts-ignore
const font = matchFont(fontStyle);

const resolution = vec(width, height);

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
        start={vec(5, 300)}
        end={vec(4, 50)}
        colors={["red", "orange"]}
      />
    </RoundedRect>
  );
};

export default function App() {
  const brickCount = useSharedValue(0);
  const clock = useClock();

  const circleObject: CircleInterface = {
    type: "Circle",
    id: 0,
    x: useSharedValue(0),
    y: useSharedValue(0),
    r: RADIUS,
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
    y: useSharedValue(height - 100),
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    height: PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
  };

  const bricks: BrickInterface[] = Array(TOTAL_BRICKS)
    .fill(0)
    .map((_, idx) => {
      const farBrickX = BRICK_MIDDLE + BRICK_WIDTH + 50;
      const middleBrickX = BRICK_MIDDLE;
      const closeBrickX = BRICK_MIDDLE - BRICK_WIDTH - 50;
      const startingY = 60;
      const ySpacing = 45;

      let startingXPosition = -1;

      if (idx % BRICK_ROW_LENGTH === 0) {
        startingXPosition = farBrickX;
      } else if (idx % BRICK_ROW_LENGTH === 1) {
        startingXPosition = middleBrickX;
      } else if (idx % BRICK_ROW_LENGTH === 2) {
        startingXPosition = closeBrickX;
      }

      const startingYPosition =
        startingY + ySpacing * Math.floor(idx / BRICK_ROW_LENGTH);

      return {
        type: "Brick",
        id: 0,
        x: useSharedValue(startingXPosition),
        y: useSharedValue(startingYPosition),
        m: 0,
        ax: 0,
        ay: 0,
        vx: 0,
        vy: 0,
        height: BRICK_HEIGHT,
        width: BRICK_WIDTH,
        canCollide: useSharedValue(true),
      };
    });

  const resetGame = () => {
    "worklet";

    rectangleObject.x.value = PADDLE_MIDDLE;

    createBouncingExample(circleObject);
    for (const brick of bricks) {
      brick.canCollide.value = true;
    }

    brickCount.value = 0;
  };

  createBouncingExample(circleObject);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
      circleObject.ax = 0.5;
      circleObject.ay = 1;
      circleObject.vx = 0;
      circleObject.vy = 0;
      return;
    }

    animate(
      [circleObject, rectangleObject, ...bricks],
      frameInfo.timeSincePreviousFrame,
      brickCount
    );
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
        resetGame();
      }
    })
    .onChange(({ x }) => {
      rectangleObject.x.value = x - PADDLE_WIDTH / 2;
    });

  const opacity = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS || brickCount.value === -1 ? 1 : 0;
  }, [brickCount]);

  const textPosition = useDerivedValue(() => {
    const endText = brickCount.value === TOTAL_BRICKS ? "YOU WIN" : "YOU LOSE";
    return (width - font.measureText(endText).width) / 2;
  }, [font]);

  const gameEndingText = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS ? "YOU WIN" : "YOU LOSE";
  }, []);

  const uniforms = useDerivedValue(() => {
    return {
      iResolution: resolution,
      iTime: clock.value * 0.0005,
    };
  }, [clock, width, height]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <Canvas style={{ flex: 1 }}>
            <Rect x={0} y={0} height={height} width={width}>
              <Shader source={shader} uniforms={uniforms} />
            </Rect>
            <Circle
              cx={circleObject.x}
              cy={circleObject.y}
              r={RADIUS}
              color={BALL_COLOR}
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
            <Rect
              x={0}
              y={0}
              height={height}
              width={width}
              color={"red"}
              opacity={opacity}
            >
              <LinearGradient
                start={vec(0, 200)}
                end={vec(0, 500)}
                colors={["#4070D3", "#EA2F86"]}
              />
            </Rect>
            <Text
              x={textPosition}
              y={height / 2}
              text={gameEndingText}
              font={font}
              opacity={opacity}
            />
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
