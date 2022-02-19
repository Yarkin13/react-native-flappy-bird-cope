import React, { useState } from "react";
import { Text, Dimensions, View, Button } from "react-native";

const GameOverView: React.FC<{ score: number; onPressRestart: () => void }> = ({
  score,
  onPressRestart,
}) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [opacity, setOpacity] = useState(0);

  const [leftWrapper, setLeftWrapper] = useState(0);
  const [topWrapper, setTopWrapper] = useState(0);

  return (
    <View
      style={{
        position: "absolute",
        flex: 1,
        zIndex: 2,
        left: leftWrapper,
        top: topWrapper,
        height: windowHeight / 3,
        width: windowWidth / 2,
        backgroundColor: "#BDB76B",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "space-around",
        opacity: opacity,
      }}
      onLayout={(event) => {
        setLeftWrapper(windowWidth / 2 - event.nativeEvent.layout.width / 2);
        setTopWrapper(windowHeight / 3 - event.nativeEvent.layout.height / 2);
        setOpacity(100);
      }}
    >
      <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>
        Game Over
      </Text>
      <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>
        Score: {score}
      </Text>
      <Button title="Restart" onPress={onPressRestart} color="#8B4513" />
    </View>
  );
};

export default GameOverView;
