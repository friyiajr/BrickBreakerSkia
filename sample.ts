import { Dimensions } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { NUM_OF_BALLS } from "./constants";

const { width, height } = Dimensions.get("window");

function getRandomInt(min: number, max: number) {
  "worklet";
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const radius = 16;
const maxSpeed = 100;

export interface ShapeInterface {
  id: number;
  /**
   * `x` position of the shape on the canvas
   */
  x: SharedValue<number>;
  /**
   * `y` position of the shape on the canvas
   */
  y: SharedValue<number>;
  /**
   * The radius of the shape
   */
  r: number;
  /**
   * The mass of the shape
   */
  m: number;
  /**
   * The acceleration of x
   */
  ax: number;
  /**
   * The acceleration of y
   */
  ay: number;
  /**
   * The velocity of x
   */
  vx: number;
  /**
   * The velocity of y
   */
  vy: number;
}

/**
 * Object representing the collision between two objects
 */
interface Collision {
  /**
   * The first shape
   */
  o1: ShapeInterface;
  /**
   * The second shape
   */
  o2: ShapeInterface;
  /**
   * Distance between the two x values
   */
  dx: number;
  /**
   * Distance betweeb the two y values
   */
  dy: number;
  /**
   * Total distance
   */
  d: number;
}

const move = (object: ShapeInterface, dt: number) => {
  "worklet";
  object.vx += object.ax * dt;
  object.vy += object.ay * dt;
  if (object.vx > maxSpeed) {
    object.vx = maxSpeed;
  }
  if (object.vx < -maxSpeed) {
    object.vx = -maxSpeed;
  }
  if (object.vy > maxSpeed) {
    object.vy = maxSpeed;
  }
  if (object.vy < -maxSpeed) {
    object.vy = -maxSpeed;
  }
  object.x.value += object.vx * dt;
  object.y.value += object.vy * dt;
};

export const resolveWallCollision = (object: ShapeInterface) => {
  "worklet";
  // Collision with the right wall
  if (object.x.value + object.r > width) {
    // Calculate the overshot
    object.x.value = width - object.r;
    object.vx = -object.vx;
    object.ax = -object.ax;
  }

  // Collision with the bottom wall
  else if (object.y.value + object.r > height) {
    object.y.value = height - object.r;
    object.vy = -object.vy;
    object.ay = -object.ay;
  }

  // Collision with the left wall
  else if (object.x.value - object.r < 0) {
    object.x.value = object.r;
    object.vx = -object.vx;
    object.ax = -object.ax;
  }

  // Detect collision with the top wall
  else if (object.y.value - object.r < 0) {
    object.y.value = object.r;
    object.vy = -object.vy;
    object.ay = -object.ay;
  }
};

export const createBouncingExample = (circleObjects: ShapeInterface[]) => {
  "worklet";
  for (let i = 0; i < NUM_OF_BALLS; i++) {
    const x = getRandomInt(radius, width - radius);
    const y = getRandomInt(radius, height - radius);

    circleObjects[i].x.value = x;
    circleObjects[i].y.value = y;
    circleObjects[i].r = radius;
    circleObjects[i].ax = getRandomInt(-1, 1);
    circleObjects[i].ay = getRandomInt(-1, 1);
    circleObjects[i].m = radius * 10;
  }
};

export const checkCollision = (o1: ShapeInterface, o2: ShapeInterface) => {
  "worklet";
  const dx = o2.x.value - o1.x.value;
  const dy = o2.y.value - o1.y.value;
  const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  if (d < o1.r + o2.r) {
    return {
      collisionInfo: { o1, o2, dx, dy, d },
      collided: true,
    };
  } else {
    return {
      collisionInfo: null,
      collided: false,
    };
  }
};

export const resolveCollisionWithBounce = (info: Collision) => {
  "worklet";
  // Eigen Vector
  const nx = info.dx / info.d;
  const ny = info.dy / info.d;

  // Penetration Depth
  const s = info.o1.r + info.o2.r - info.d;

  info.o1.x.value -= (nx * s) / 2;
  info.o1.y.value -= (ny * s) / 2;

  info.o2.x.value += (nx * s) / 2;
  info.o2.y.value += (ny * s) / 2;

  const k =
    (-2 * ((info.o2.vx - info.o1.vx) * nx + (info.o2.vy - info.o1.vy) * ny)) /
    (1 / info.o1.m + 1 / info.o2.m);

  info.o1.vx -= (k * nx) / info.o1.m;
  info.o1.vy -= (k * ny) / info.o1.m;

  info.o2.vx += (k * nx) / info.o2.m;
  info.o2.vy += (k * ny) / info.o2.m;
};

export const animate = (
  objects: ShapeInterface[],
  timeSincePreviousFrame: number
) => {
  "worklet";

  for (const o of objects) {
    move(o, (0.1 / 16) * timeSincePreviousFrame);
  }

  for (const o of objects) {
    resolveWallCollision(o);
  }

  const collisions: Collision[] = [];

  for (const [i, o1] of objects.entries()) {
    for (const [j, o2] of objects.entries()) {
      if (i < j) {
        const { collided, collisionInfo } = checkCollision(o1, o2);
        if (collided && collisionInfo) {
          collisions.push(collisionInfo);
        }
      }
    }
  }

  for (const col of collisions) {
    resolveCollisionWithBounce(col);
  }
};
