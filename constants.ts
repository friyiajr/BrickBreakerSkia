import { Dimensions } from "react-native";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export const LIME_GREEN = "#4AF626";

export const PADDLE_HEIGHT = 30;
export const PADDLE_WIDTH = 100;
export const BRICK_HEIGHT = 25;
export const BRICK_WIDTH = 80;
export const X_MIDDLE = windowWidth / 2 - BRICK_WIDTH / 2;

export const height = windowHeight;
export const width = windowWidth;
