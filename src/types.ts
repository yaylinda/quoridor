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
  player1ActionNumber: number;
  player2ActionNumber: number;
  currentTurn: string | null;
  actions: GameAction[];
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
  to: Coordinate | null;
  from: Coordinate;
}

export enum CellType {
  WALL = "WALL",
  CELL = "CELL",
  BLANK = "BLANK",
}

export interface CellData {
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
