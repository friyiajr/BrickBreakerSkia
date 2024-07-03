import { SharedValue } from "react-native-reanimated";

type ShapeVariant = "Circle" | "Paddle" | "Brick";

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
  /**
   * Type
   */
  type: ShapeVariant;
}

export interface CircleInterface extends ShapeInterface {
  type: "Circle";
  /**
   * The radius of the shape
   */
  r: number;
}

export interface PaddleInterface extends ShapeInterface {
  type: "Paddle";
  /**
   * The height of the shape
   */
  height: number;
  /**
   * The width of the shape
   */
  width: number;
}

export interface BrickInterface extends ShapeInterface {
  type: "Brick";
  /**
   * The height of the shape
   */
  height: number;
  /**
   * The width of the shape
   */
  width: number;
  /**
   * State that determindes whether a ball can collide with a brick
   */
  canCollide: SharedValue<boolean>;
}

/**
 * Object representing the collision between two objects
 */
export interface Collision {
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
