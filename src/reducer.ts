import { GameState, GameStateAction } from "./types";

export const gameStateReducer = (state: GameState, action: GameStateAction) => {
  switch (action.type) {
    case "incTopPositionBird":
      return {
        ...state,
        topPositionBird: state.topPositionBird + action.payload,
      };
    case "decTopPositionBird":
      return {
        ...state,
        topPositionBird: state.topPositionBird - action.payload,
      };
    case "setNewLeftPositionFirstPipes":
      return { ...state, leftPositionFirstPipes: action.payload };
    case "setNewLeftPositionSecondPipes":
      return { ...state, leftPositionSecondPipes: action.payload };
    case "decLeftPositionFirstPipes":
      return {
        ...state,
        leftPositionFirstPipes: state.leftPositionFirstPipes - action.payload,
      };
    case "decLeftPositionSecondPipes":
      return {
        ...state,
        leftPositionSecondPipes: state.leftPositionSecondPipes - action.payload,
      };
    case "changeOnFall":
      return { ...state, isFall: action.payload };
    case "changeOnJump":
      return { ...state, isJump: action.payload };
    case "changeHeightUpperFirstPipe":
      return { ...state, heightUpperFirstPipe: action.payload };
    case "changeHeightUpperSecondPipe":
      return { ...state, heightUpperSecondPipe: action.payload };
    case "changeOnPipeSaveZone":
      return { ...state, inPipeSaveZone: action.payload };
    case "incScore":
      return { ...state, score: state.score + 1 };
    case "startGame":
      return { ...state, isWaitToStart: action.payload };
    case "gameOver":
      return { ...state, isGameOver: action.payload };
    case "resetGameState":
      return { ...action.payload };

    default:
      return state;
  }
};
