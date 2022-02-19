import React, { useState } from "react";
import { Text, Dimensions } from "react-native";
import { COEFFICIENT_SCORE_TOP_POSITION } from "../../constants";

const Score: React.FC<{ score: number }> = ({ score }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const top = windowHeight * COEFFICIENT_SCORE_TOP_POSITION;

  const [left, setLeft] = useState(0);
  const [opacity, setOpacity] = useState(0);

  return (
    <Text
      style={{
        position: "absolute",
        top: top,
        left: left,
        color: "white",
        fontSize: 70,
        fontWeight: "bold",
        opacity: opacity,
      }}
      onLayout={(event) => {
        setLeft(windowWidth / 2 - event.nativeEvent.layout.width / 2);
        setOpacity(100);
      }}
    >
      {score}
    </Text>
  );
};

export default Score;
