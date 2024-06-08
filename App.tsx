import {
  Canvas,
  Circle,
  Group,
  Line,
  vec,
  LinearGradient,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const CIRCLE_Y = 30;
const INITIAL_X = 20;

interface Props {
  delay: number;
  yOffset: number;
}

const MovingCircle = ({ yOffset, delay }: Props) => {
  const xPos = useSharedValue(INITIAL_X);
  const xPosInverse = useSharedValue(180);

  const circleRadius = useSharedValue(12);
  const inverseCircleRadius = useSharedValue(12);

  useEffect(() => {
    xPos.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(180, { duration: 900 }),
          withTiming(INITIAL_X, { duration: 900 })
        ),
        -1
      )
    );

    xPosInverse.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(INITIAL_X, { duration: 900 }),
          withTiming(180, { duration: 900 })
        ),
        -1
      )
    );

    circleRadius.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(8, { duration: 450 }),
          withTiming(12, { duration: 450 }),
          withTiming(18, { duration: 450 }),
          withTiming(12, { duration: 450 })
        ),
        -1
      )
    );

    inverseCircleRadius.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(18, { duration: 450 }),
          withTiming(12, { duration: 450 }),
          withTiming(8, { duration: 450 }),
          withTiming(12, { duration: 450 })
        ),
        -1
      )
    );
  }, []);

  const point1 = useDerivedValue(() => {
    return vec(xPos.value, yOffset + CIRCLE_Y);
  }, [xPos, xPosInverse]);

  const point2 = useDerivedValue(() => {
    return vec(xPosInverse.value, yOffset + CIRCLE_Y);
  }, [xPos, xPosInverse]);

  return (
    <>
      <Group color="red">
        <LinearGradient
          start={vec(100, 0)}
          end={vec(100, 400)}
          colors={["#e0fbfc", "#3d5a80"]}
        />
        <Line p1={point1} p2={point2} strokeWidth={3} />
        <Circle cx={xPos} cy={CIRCLE_Y + yOffset} r={circleRadius} />
        <Circle
          cx={xPosInverse}
          cy={CIRCLE_Y + yOffset}
          r={inverseCircleRadius}
        />
      </Group>
    </>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <Canvas style={{ height: 400, width: 200 }}>
        <MovingCircle delay={0} yOffset={0} />
        <MovingCircle delay={125} yOffset={75} />
        <MovingCircle delay={250} yOffset={150} />
        <MovingCircle delay={375} yOffset={225} />
        <MovingCircle delay={500} yOffset={300} />
      </Canvas>
      <View style={styles.titleContainer}>
        <Text style={styles.titleTextNormal}>Genetic</Text>
        <Text style={styles.titleTextBold}>AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
