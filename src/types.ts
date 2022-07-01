import { Timestamp } from "firebase/firestore/lite";

export interface User {
  id: string;
  username: string;
}

export interface UserCollectionObject extends User {
  createdDate: Timestamp;
  lastLoginDate: Timestamp;
  games: UserGame[];
}

export enum GameType {
  Quoridor = "Quoridor",
}

export interface UserGame {
  gameId: string;
  gameType: GameType;
}

export interface GameCollectionObject {
  id: string;
  displayName: string;
  type: GameType;
  player1: User;
  player2: User | null;
  createdDate: Timestamp;
  currentTurn: string | null;
  actions: GameAction[];
  player1Location: Coordinate; // coordinate of player 1, wrt player1's view of the board
  player2Location: Coordinate | null; // coordinate of player 2, wrt player1's view of the board
  winner: string | null; // userId of the winning player
}

export interface GameAction {
  type: GameActionType;
  userId: string;
  createdDate: Timestamp;
  metadata: GameActionMetadata | null;
}

export enum GameActionType {
  CREATE_GAME = "CREATE_GAME",
  JOIN_GAME = "JOIN_GAME",
  MOVE_PIECE = "MOVE_PIECE",
  PLACE_WALL = "PLACE_WALL",
}

export interface GameActionMetadata {
  // wrt player1's view of the board
  coord1: Coordinate;
  coord2: Coordinate;
}

export enum CellType {
  WALL = "WALL",
  CELL = "CELL",
  BLANK = "BLANK",
}

export interface CellData {
  id: string;
  row: number;
  col: number;
  type: CellType;
  isWall: boolean; // only applicable for CellType.WALL - is the wall filled or empty
  occupiedBy: string | null; // only applicable for CellType.CELL - the userId that this cell is occupied by
}

export interface Coordinate {
  row: number;
  col: number;
}
