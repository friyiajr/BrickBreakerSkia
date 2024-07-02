import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import {
  ShapeInterface,
  animate,
  createBouncingExample,
  radius,
} from "./sample";

const LIME_GREEN = "#4AF626";

const { height, width } = Dimensions.get("window");
const BOTTOM = height - 120;
const PADDLE_HEIGHT = 20;
const PADDLE_Y = BOTTOM - PADDLE_HEIGHT;
const TOP = 10;
// 10 frames every 16 milliseconds
const GAME_SPEED = 10 / 16;

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

interface CircleProps {
  circlePosition: ShapeInterface;
}

const MovingCircle = ({ circlePosition }: CircleProps) => {
  return (
    <Circle
      cx={circlePosition.x}
      cy={circlePosition.y}
      r={radius}
      color={LIME_GREEN}
    />
  );
};

export default function App() {
  const isLoaded = useSharedValue(false);

  const circleObjects: ShapeInterface[] = Array(16)
    .fill(0)
    .map((_, i) => {
      return {
        id: i,
        x: useSharedValue(0),
        y: useSharedValue(0),
        r: radius,
        m: 0,
        ax: 0,
        ay: 0,
        vx: 0,
        vy: 0,
      };
    });

  useEffect(() => {
    createBouncingExample(circleObjects);
    isLoaded.value = true;
  }, []);

  useFrameCallback((frameInfo) => {
    if (!isLoaded.value) {
      return;
    }
    animate(circleObjects);
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Canvas style={{ flex: 1 }}>
          {Array(16)
            .fill(0)
            .map((_, idx) => {
              return (
                <MovingCircle key={idx} circlePosition={circleObjects[idx]} />
              );
            })}
        </Canvas>
      </View>
    </GestureHandlerRootView>
  );
}

// export default function App() {
//   const isDecending = useSharedValue(true);
//   const paddleX = useSharedValue(100);
//   const circleX = useSharedValue(100);
//   const circleY = useSharedValue(0);

//   const gesture = Gesture.Pan().onChange(({ x }) => {
//     paddleX.value = x;
//   });

//   useFrameCallback((frameInfo) => {
//     if (!frameInfo.timeSincePreviousFrame) {
//       return;
//     }

//     const distance = dist(
//       { x: circleX.value, y: circleY.value },
//       {
//         x: paddleX.value,
//         y: PADDLE_Y,
//       }
//     );

//     if (distance <= PADDLE_HEIGHT) {
//       isDecending.value = false;
//       circleY.value -= frameInfo.timeSincePreviousFrame * GAME_SPEED;
//       return;
//     }

//     // This can probably be removed later.
//     // You lose the game if this happens
//     if (circleY.value >= BOTTOM) {
//       isDecending.value = false;
//     }

//     if (circleY.value <= TOP) {
//       isDecending.value = true;
//     }

//     if (isDecending.value) {
//       circleY.value += frameInfo.timeSincePreviousFrame * GAME_SPEED;
//     } else {
//       circleY.value -= frameInfo.timeSincePreviousFrame * GAME_SPEED;
//     }
//   });

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={gesture}>
//         <SafeAreaView style={styles.container}>
//           <Canvas style={{ height: BOTTOM }}>
//             <Circle cx={100} cy={circleY} color={LIME_GREEN} r={TOP} />
//             <Rect
//               x={paddleX}
//               y={PADDLE_Y}
//               height={PADDLE_HEIGHT}
//               width={100}
//               color={"white"}
//             />
//           </Canvas>
//         </SafeAreaView>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// }

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
