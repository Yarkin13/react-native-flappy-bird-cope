import React, { useMemo } from "react";
import { Image, Dimensions } from "react-native";
import { PipesProps } from "./types";
import {
  COEFFICIENT_PIPE_HEAD_WIDTH,
  COEFFICIENT_PIPE_WIDTH,
  PIPE_HEAD_HEIGHT,
  COEFFICIENT_MAIN_BACKGROUND,
} from "../../constants";

const Pipes: React.FC<PipesProps> = ({
  leftPosition,
  upperHeight,
  bottomHeight,
}) => {
  const windowWidth = useMemo(() => Dimensions.get("window").width, []);
  const windowHeight = useMemo(() => Dimensions.get("window").height, []);
  const pipeWidth = useMemo(() => windowWidth * COEFFICIENT_PIPE_WIDTH, []);
  const headWidth = useMemo(
    () => windowWidth * COEFFICIENT_PIPE_HEAD_WIDTH,
    []
  );

  return (
    <>
      <Image
        source={require("../../../assets/pipe.png")}
        style={{
          width: pipeWidth,
          height: upperHeight,
          position: "absolute",
          top: 0,
          left: leftPosition,
        }}
      />
      <Image
        source={require("../../../assets/pipe_head.png")}
        style={{
          width: headWidth,
          height: PIPE_HEAD_HEIGHT,
          position: "absolute",
          top: upperHeight,
          left: leftPosition + pipeWidth / 2 - headWidth / 2,
          resizeMode: "stretch",
        }}
      />
      <Image
        source={require("../../../assets/pipe_head.png")}
        style={{
          width: headWidth,
          height: PIPE_HEAD_HEIGHT,
          position: "absolute",
          resizeMode: "stretch",
          bottom:
            bottomHeight + windowHeight * (1 - COEFFICIENT_MAIN_BACKGROUND),
          left: leftPosition + pipeWidth / 2 - headWidth / 2,
        }}
      />
      <Image
        source={require("../../../assets/pipe.png")}
        style={{
          width: pipeWidth,
          height: bottomHeight + 1,
          position: "absolute",
          bottom: windowHeight * (1 - COEFFICIENT_MAIN_BACKGROUND),
          left: leftPosition,
        }}
      />
    </>
  );
};

export default Pipes;
