import {
  COEFFICIENT_BIRD_WIDTH,
  COEFFICIENT_MAIN_BACKGROUND,
  TABLET_BIRD_WIDTH,
  TABLET_BREAKPOINT,
} from "./constants";

export const getHeightUpperPipe = (
  windowHeight: number,
  gapBetweenPipes: number
) => {
  const maxPipeHeight =
    windowHeight -
    gapBetweenPipes -
    windowHeight * (1 - COEFFICIENT_MAIN_BACKGROUND);

  const pipeHeight = Math.random() * maxPipeHeight;

  if (pipeHeight < 0.05 * windowHeight) {
    return windowHeight * 0.1;
  }

  if (pipeHeight > 0.95 * maxPipeHeight) {
    return maxPipeHeight * 0.9;
  }

  return pipeHeight;
};

export const getBirdWidth = (windowWidth: number) => {
  if (windowWidth > TABLET_BREAKPOINT) return TABLET_BIRD_WIDTH;
  return windowWidth * COEFFICIENT_BIRD_WIDTH;
};
