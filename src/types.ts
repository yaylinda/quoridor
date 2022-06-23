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
    Quoridor,
}

export interface UserGame {
    gameId: string,
    gameType: GameType, 
}

export interface GameCollectionObject {
    id: string,
    name: string,
    type: GameType,
    players: User[],
    createdDate: Timestamp,
    actions: GameAction[],
}

export interface GameAction {
    type: GameActionType,
    user: User,
    createdDate: Timestamp,
}

export enum GameActionType {
    START_GAME,
}