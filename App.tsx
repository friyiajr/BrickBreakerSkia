import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import { LIME_GREEN, PADDLE_HEIGHT, PADDLE_WIDTH, height } from "./constants";
import {
  CircleInterface,
  PaddleInterface,
  animate,
  createBouncingExample,
  radius,
} from "./sample";

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

  createBouncingExample(circleObject);

  const rectangleOffset = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    animate([circleObject, rectangleObject], frameInfo.timeSincePreviousFrame);
  });

  const gesture = Gesture.Pan()
    // .onBegin(({ x }) => {
    //   rectangleObject.x.value = rectangleOffset.value;
    // })
    .onChange(({ x }) => {
      rectangleObject.x.value = x / 2;
    });
  // .onEnd(({ x }) => {
  //   rectangleOffset.value = x;
  // });
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
          </Canvas>
        </View>
      </GestureDetector>
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
