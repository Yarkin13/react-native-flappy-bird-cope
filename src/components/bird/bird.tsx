import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Animated, Easing, Dimensions } from "react-native";
import { BirdProps } from "./types";
import {
  BIRD_FALL_ROTATE_TIME,
  BIRD_JUMP_ROTATE_TIME,
  COEFFICIENT_MAIN_BACKGROUND,
  FALL_AFTER_GAME_OVER_TIME,
} from "../../constants";

const Bird: React.FC<BirdProps> = ({
  topPosition,
  leftPosition,
  width,
  height,
  isFall,
  isJump,
  isWaitToStart,
  isGameOver,
}) => {
  const spinValue = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const windowHeight = Dimensions.get("window").height;

  const [topForAnimate, setTopForAnimate] = useState(
    new Animated.Value(windowHeight / 2)
  );

  const spin = useMemo(
    () =>
      spinValue.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: ["20deg", "-20deg", "0deg", "90deg"],
      }),
    []
  );

  const rotateForJump = useCallback(
    () =>
      Animated.timing(spinValue, {
        toValue: 1,
        duration: BIRD_JUMP_ROTATE_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(),
    []
  );

  const rotateForFall = useCallback(() => {
    Animated.timing(spinValue, {
      toValue: 0,
      duration: BIRD_FALL_ROTATE_TIME,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotateForGameOver = useCallback(() => {
    Animated.timing(spinValue, {
      toValue: 3,
      duration: BIRD_FALL_ROTATE_TIME,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotateToWaitToStart = useCallback(() => {
    Animated.timing(spinValue, {
      toValue: 2,
      duration: BIRD_FALL_ROTATE_TIME,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isJump && !isWaitToStart) rotateForJump();
    if (isFall && !isWaitToStart) rotateForFall();
    if (isWaitToStart) rotateToWaitToStart();
    if (!isWaitToStart && isGameOver) rotateForGameOver();
  }, [isJump, isFall, isWaitToStart, isGameOver]);

  const wiggle = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(topForAnimate, {
          toValue: windowHeight / 2 - 25,
          duration: 500,
          delay: 0,
          useNativeDriver: false,
        }),
        Animated.timing(topForAnimate, {
          toValue: windowHeight / 2,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start(() => wiggle);
  };

  const fallAfterGameOver = () => {
    const fallAfterGameOverDuration =
      ((windowHeight - topPosition) / 500) * 1000;

    Animated.timing(topForAnimate, {
      toValue: windowHeight * COEFFICIENT_MAIN_BACKGROUND - height,
      duration: fallAfterGameOverDuration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isWaitToStart) wiggle();
  }, [isWaitToStart]);

  useEffect(() => {
    if (isGameOver) {
      topForAnimate.setValue(topPosition);
      fallAfterGameOver();
    }
  }, [isGameOver]);

  const topInStyle = isWaitToStart || isGameOver ? topForAnimate : topPosition;

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          left: leftPosition,
          top: topInStyle,
          zIndex: 1,
        }}
      >
        <Animated.Image
          source={require("../../../assets/bird.png")}
          style={{
            width: width,
            height: height,
            resizeMode: "contain",
            transform: [{ rotate: spin }],
          }}
        />
      </Animated.View>
    </>
  );
};

export default Bird;
