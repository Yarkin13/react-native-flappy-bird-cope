import React, { useEffect, useState, useRef } from "react";
import { Image, Dimensions } from "react-native";
import {
  COEFFICIENT_MAIN_BACKGROUND,
  EARTH_LINE_HEIGHT,
  PIPE_MOVE_SPEED,
} from "../../constants";

const EarthLine: React.FC<{ pipePosition: number; isWaitToStart: boolean }> = ({
  pipePosition,
  isWaitToStart,
}) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const earthLineWidth = windowWidth * 10;

  const [leftPosition, setLeftPosition] = useState(0);

  const requestAnimation = useRef(0);

  const moveLine = () => {
    requestAnimation.current = requestAnimationFrame(function move() {
      setLeftPosition((prev) => {
        if (prev < -windowWidth * 9) setLeftPosition(0);
        return prev - PIPE_MOVE_SPEED;
      });

      requestAnimationFrame(move);
    });
  };

  const left = isWaitToStart ? leftPosition : pipePosition - windowWidth;

  useEffect(() => {
    moveLine();
  }, []);

  return (
    <Image
      source={require("../../../assets/earth_line.png")}
      style={{
        width: earthLineWidth,
        height: EARTH_LINE_HEIGHT,
        position: "absolute",
        resizeMode: "cover",
        top: windowHeight * COEFFICIENT_MAIN_BACKGROUND,
        left: left,
      }}
    />
  );
};

export default EarthLine;
