import { Timestamp } from "firebase/firestore/lite";

interface CollectionObject {
    id: string,
    createdDate: Timestamp,
}

export interface UserCollectionObject extends CollectionObject {
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

export interface GameCollectionObject extends CollectionObject {

}
