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
    players: User[],
    createdDate: Timestamp,
    actions: GameAction[],
    boardFlattened: CellData[],
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
}

export interface CellData {
    row: number,
    col: number,
    type: CellType,
    occupant: null | User,
}