import { Dimensions } from "react-native";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export const NUM_OF_BALLS = 1;

export const LIME_GREEN = "#4AF626";

export const PADDLE_HEIGHT = 50;
export const PADDLE_WIDTH = 150;
export const BRICK_HEIGHT = 25;
export const BRICK_WIDTH = 100;

export const BOTTOM = windowHeight - 120;

export const PADDLE_Y = BOTTOM - PADDLE_HEIGHT;
export const TOP = 10;

// 10 frames every 16 milliseconds
export const GAME_SPEED = 10 / 16;

export const height = windowHeight;
export const width = windowWidth;
