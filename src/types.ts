import { Timestamp } from "firebase/firestore/lite";

export interface User {
    id: string,
    username: string,
}

export interface UserCollectionObject extends User {
    createdDate: Timestamp,
    lastLoginDate: Timestamp,
    games: UserGame[],
}

export enum GameType {
    Quoridor = 'Quoridor',
}

export interface UserGame {
    gameId: string,
    gameType: GameType, 
}

export interface GameCollectionObject {
    id: string,
    displayName: string,
    type: GameType,
    player1: User,
    player2: User | null,
    createdDate: Timestamp,
    player1ActionNumber: number,
    player2ActionNumber: number,
    currentTurn: string | null,
    actions: GameAction[],
}

export interface GameAction {
    type: GameActionType,
    user: User,
    createdDate: Timestamp,
}

export enum GameActionType {
    START_GAME = 'START_GAME',
}

export enum CellType {
    WALL = 'WALL',
    CELL = 'CELL',
    BLANK = 'BLANK',
}

export interface CellData {
    row: number,
    col: number,
    type: CellType,
    isWall: boolean,
}