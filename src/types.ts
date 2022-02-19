export interface GameState {
  topPositionBird: number;
  leftPositionFirstPipes: number;
  leftPositionSecondPipes: number;
  isFall: boolean;
  isJump: boolean;
  heightUpperFirstPipe: number;
  heightUpperSecondPipe: number;
  inPipeSaveZone: boolean;
  score: number;
  isWaitToStart: boolean;
  isGameOver: boolean;
}

export enum GameStateActionTypes {
  incTopPositionBird = "incTopPositionBird",
  decTopPositionBird = "decTopPositionBird",
  decLeftPositionFirstPipes = "decLeftPositionFirstPipes",
  setNewLeftPositionFirstPipes = "setNewLeftPositionFirstPipes",
  decLeftPositionSecondPipes = "decLeftPositionSecondPipes",
  setNewLeftPositionSecondPipes = "setNewLeftPositionSecondPipes",
  changeOnFall = "changeOnFall",
  changeOnJump = "changeOnJump",
  changeHeightUpperFirstPipe = "changeHeightUpperFirstPipe",
  changeHeightUpperSecondPipe = "changeHeightUpperSecondPipe",
  changeOnPipeSaveZone = "changeOnPipeSaveZone",
  incScore = "incScore",
  startGame = "startGame",
  gameOver = "gameOver",
  resetGameState = "resetGameState",
}

export type GameStateAction =
  | { type: GameStateActionTypes.resetGameState; payload: GameState }
  | { type: GameStateActionTypes.incTopPositionBird; payload: number }
  | { type: GameStateActionTypes.decTopPositionBird; payload: number }
  | { type: GameStateActionTypes.decLeftPositionSecondPipes; payload: number }
  | {
      type: GameStateActionTypes.decLeftPositionFirstPipes;
      payload: number;
    }
  | { type: GameStateActionTypes.setNewLeftPositionFirstPipes; payload: number }
  | {
      type: GameStateActionTypes.setNewLeftPositionSecondPipes;
      payload: number;
    }
  | { type: GameStateActionTypes.changeOnFall; payload: boolean }
  | { type: GameStateActionTypes.changeOnJump; payload: boolean }
  | { type: GameStateActionTypes.changeHeightUpperFirstPipe; payload: number }
  | { type: GameStateActionTypes.changeHeightUpperSecondPipe; payload: number }
  | { type: GameStateActionTypes.incScore }
  | { type: GameStateActionTypes.startGame; payload: boolean }
  | { type: GameStateActionTypes.gameOver; payload: boolean }
  | { type: GameStateActionTypes.changeOnPipeSaveZone; payload: boolean };
