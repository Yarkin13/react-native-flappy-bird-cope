import React, { useEffect, useReducer, useRef, useMemo } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Dimensions,
  Image,
} from "react-native";
import Bird from "./src/components/bird/bird";
import Pipes from "./src/components/pipes/pipes";
import { getHeightUpperPipe, getBirdWidth } from "./src/utils";
import {
  FALL_SPEED,
  JUMP_SPEED,
  JUMP_TIME,
  BIRD_OFFSET,
  COEFFICIENT_PIPE_WIDTH,
  COEFFICIENT_PIPES_GAP,
  COEFFICIENT_MAIN_BACKGROUND,
  EARTH_LINE_HEIGHT,
  PIPE_MOVE_SPEED,
  PIPE_HEAD_HEIGHT,
  COEFFICIENT_PIPE_HEAD_WIDTH,
} from "./src/constants";
import { gameStateReducer } from "./src/reducer";
import { GameStateActionTypes } from "./src/types";
import EarthLine from "./src/components/earth-line/earth-line";
import Score from "./src/components/score/score";
import GameOverView from "./src/components/gameover-view/gameover-view";

export default function App() {
  const windowWidth = useMemo(() => Dimensions.get("window").width, []);
  const windowHeight = useMemo(() => Dimensions.get("window").height, []);

  const birdWidth = useMemo(() => getBirdWidth(windowWidth), []);
  const birdHeight = useMemo(() => birdWidth, []);
  const leftPositionBird = useMemo(() => windowWidth * BIRD_OFFSET, []);

  const pipeWidth = useMemo(() => windowWidth * COEFFICIENT_PIPE_WIDTH, []);
  const gapBetweenPipes = useMemo(() => birdHeight * COEFFICIENT_PIPES_GAP, []);
  const pipeHeadWidth = useMemo(
    () => windowWidth * COEFFICIENT_PIPE_HEAD_WIDTH,
    []
  );
  const offsetWindowOnHeadPipe = useMemo(
    () => -(pipeWidth - pipeHeadWidth) / 2,
    []
  );

  const earthHeight = useMemo(
    () => windowHeight * (1 - COEFFICIENT_MAIN_BACKGROUND),
    []
  );

  const requestAnimation = useRef(0);

  const initGameState = useMemo(() => {
    return {
      topPositionBird: windowHeight / 2 - birdHeight / 2,
      leftPositionFirstPipes: windowWidth + offsetWindowOnHeadPipe,
      leftPositionSecondPipes:
        windowWidth + windowWidth / 2 + pipeWidth - offsetWindowOnHeadPipe,
      isFall: true,
      isJump: false,
      heightUpperFirstPipe: getHeightUpperPipe(windowHeight, gapBetweenPipes),
      heightUpperSecondPipe: getHeightUpperPipe(windowHeight, gapBetweenPipes),
      inPipeSaveZone: false,
      score: 0,
      isWaitToStart: true,
      isGameOver: false,
    };
  }, []);

  const [gameState, dispatchGameState] = useReducer(
    gameStateReducer,
    initGameState
  );

  const fallBird = () => {
    dispatchGameState({
      type: GameStateActionTypes.incTopPositionBird,
      payload: FALL_SPEED,
    });
  };

  const jumpBird = () => {
    const jumpStartTime = Date.now();

    requestAnimation.current = requestAnimationFrame(function jump() {
      const interval = Date.now() - jumpStartTime;

      if (gameState.topPositionBird > 0) {
        dispatchGameState({
          type: GameStateActionTypes.decTopPositionBird,
          payload: JUMP_SPEED,
        });
      }

      if (interval < JUMP_TIME) {
        requestAnimation.current = requestAnimationFrame(jump);
      } else {
        dispatchGameState({
          type: GameStateActionTypes.changeOnFall,
          payload: true,
        });

        dispatchGameState({
          type: GameStateActionTypes.changeOnJump,
          payload: false,
        });
      }
    });
  };

  const onPressJump = () => {
    if (gameState.isGameOver) return;

    dispatchGameState({
      type: GameStateActionTypes.changeOnFall,
      payload: false,
    });

    dispatchGameState({
      type: GameStateActionTypes.changeOnJump,
      payload: true,
    });

    dispatchGameState({
      type: GameStateActionTypes.startGame,
      payload: false,
    });

    cancelAnimationFrame(requestAnimation.current);

    jumpBird();
  };

  const onPressRestart = () => {
    dispatchGameState({
      type: GameStateActionTypes.resetGameState,
      payload: initGameState,
    });
  };

  const movePipes = () => {
    // move first pipe group
    if (gameState.leftPositionFirstPipes > -pipeWidth) {
      dispatchGameState({
        type: GameStateActionTypes.decLeftPositionFirstPipes,
        payload: PIPE_MOVE_SPEED,
      });
    } else {
      dispatchGameState({
        type: GameStateActionTypes.changeHeightUpperFirstPipe,
        payload: getHeightUpperPipe(windowHeight, gapBetweenPipes),
      });
      dispatchGameState({
        type: GameStateActionTypes.setNewLeftPositionFirstPipes,
        payload: windowWidth + offsetWindowOnHeadPipe,
      });
    }

    // move second pipe group
    if (gameState.leftPositionSecondPipes > -pipeWidth) {
      dispatchGameState({
        type: GameStateActionTypes.decLeftPositionSecondPipes,
        payload: PIPE_MOVE_SPEED,
      });
    } else {
      dispatchGameState({
        type: GameStateActionTypes.setNewLeftPositionSecondPipes,
        payload: windowWidth + offsetWindowOnHeadPipe,
      });
      dispatchGameState({
        type: GameStateActionTypes.changeHeightUpperSecondPipe,
        payload: getHeightUpperPipe(windowHeight, gapBetweenPipes),
      });
    }
  };

  // effect for move layout
  useEffect(() => {
    if (gameState.isFall && !gameState.isWaitToStart) {
      requestAnimationFrame(fallBird);
    }

    !gameState.isWaitToStart && requestAnimationFrame(movePipes);
  }, [gameState.topPositionBird, gameState.isFall]);

  // effect calculate end game
  useEffect(() => {
    if (
      // crash at earth
      gameState.topPositionBird + birdHeight >
      windowHeight * COEFFICIENT_MAIN_BACKGROUND
    ) {
      dispatchGameState({
        type: GameStateActionTypes.changeOnFall,
        payload: false,
      });

      dispatchGameState({ type: GameStateActionTypes.gameOver, payload: true });
    }

    const topPositionFirstFreeZone =
      gameState.heightUpperFirstPipe + PIPE_HEAD_HEIGHT;
    const botPositionFirstFreeZone =
      gameState.heightUpperFirstPipe + gapBetweenPipes - 2 * PIPE_HEAD_HEIGHT;

    const topPositionSecondFreeZone =
      gameState.heightUpperSecondPipe + PIPE_HEAD_HEIGHT;
    const botPositionSecondFreeZone =
      gameState.heightUpperSecondPipe + gapBetweenPipes - 2 * PIPE_HEAD_HEIGHT;

    // crash on pipe
    if (
      (leftPositionBird > gameState.leftPositionFirstPipes - pipeWidth &&
        leftPositionBird < gameState.leftPositionFirstPipes + pipeWidth &&
        !(
          gameState.topPositionBird > topPositionFirstFreeZone &&
          gameState.topPositionBird < botPositionFirstFreeZone
        )) ||
      (leftPositionBird > gameState.leftPositionSecondPipes - pipeWidth &&
        leftPositionBird < gameState.leftPositionSecondPipes + pipeWidth &&
        !(
          gameState.topPositionBird > topPositionSecondFreeZone &&
          gameState.topPositionBird < botPositionSecondFreeZone
        ))
    ) {
      dispatchGameState({
        type: GameStateActionTypes.changeOnFall,
        payload: false,
      });

      dispatchGameState({ type: GameStateActionTypes.gameOver, payload: true });
    }

    // in pipe saveZone, handle score
    if (
      !(
        (leftPositionBird > gameState.leftPositionFirstPipes - pipeWidth &&
          leftPositionBird < gameState.leftPositionFirstPipes + pipeWidth) ||
        (leftPositionBird > gameState.leftPositionSecondPipes - pipeWidth &&
          leftPositionBird < gameState.leftPositionSecondPipes + pipeWidth)
      )
    ) {
      dispatchGameState({
        type: GameStateActionTypes.changeOnPipeSaveZone,
        payload: false,
      });
    } else {
      {
        dispatchGameState({
          type: GameStateActionTypes.changeOnPipeSaveZone,
          payload: true,
        });
      }
    }
  }, [gameState.topPositionBird]);

  // increment score
  useEffect(() => {
    if (gameState.inPipeSaveZone) {
      dispatchGameState({ type: GameStateActionTypes.incScore });
    }
  }, [gameState.inPipeSaveZone]);

  return (
    <View style={styles.container}>
      <TouchableHighlight
        activeOpacity={1}
        style={styles.container}
        onPress={onPressJump}
      >
        <View style={styles.container}>
          <Image
            source={require("./assets/main_background.png")}
            style={{
              width: windowWidth,
              height: windowHeight * COEFFICIENT_MAIN_BACKGROUND,
              resizeMode: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <EarthLine
            pipePosition={
              gameState.leftPositionFirstPipes - offsetWindowOnHeadPipe
            }
            isWaitToStart={gameState.isWaitToStart}
          />
          <Image
            source={require("./assets/earth.png")}
            style={{
              width: windowWidth,
              height:
                windowHeight * (1 - COEFFICIENT_MAIN_BACKGROUND) -
                EARTH_LINE_HEIGHT,
              resizeMode: "cover",
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          />
          <Bird
            topPosition={gameState.topPositionBird}
            leftPosition={leftPositionBird}
            width={birdWidth}
            height={birdWidth}
            isFall={gameState.isFall}
            isJump={gameState.isJump}
            isWaitToStart={gameState.isWaitToStart}
            isGameOver={gameState.isGameOver}
          />
          <Pipes
            leftPosition={gameState.leftPositionFirstPipes}
            upperHeight={gameState.heightUpperFirstPipe}
            bottomHeight={
              windowHeight -
              gapBetweenPipes -
              gameState.heightUpperFirstPipe -
              earthHeight
            }
          />
          <Pipes
            leftPosition={gameState.leftPositionSecondPipes}
            upperHeight={gameState.heightUpperSecondPipe}
            bottomHeight={
              windowHeight -
              gapBetweenPipes -
              gameState.heightUpperSecondPipe -
              earthHeight
            }
          />
          {!gameState.isGameOver && !gameState.isWaitToStart && (
            <Score score={gameState.score} />
          )}
          {gameState.isGameOver && (
            <GameOverView
              onPressRestart={onPressRestart}
              score={gameState.score}
            />
          )}
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
});
