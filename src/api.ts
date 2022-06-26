import { arrayUnion } from "firebase/firestore";
import {
  collection,
  doc,
  getFirestore,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore/lite";
import { app } from "./firebase";
import {
  GameAction,
  GameActionType,
  GameCollectionObject,
  GameType,
  User,
  UserCollectionObject,
} from "./types";
import { randomSingleDigit } from "./utils/randomInteger";

const db = getFirestore(app);

export const usersCollection = collection(db, "users");
export const gamesCollection = collection(db, "games");

/**
 *
 * @param user
 */
export const createUser = async (user: User): Promise<void> => {
  const userDoc: UserCollectionObject = {
    ...user,
    createdDate: Timestamp.now(),
    lastLoginDate: Timestamp.now(),
    games: [],
  };

  try {
    await setDoc(doc(usersCollection, user.id), userDoc);
  } catch (e) {
    throw new Error(`Error creating new user: ${JSON.stringify(e)}`);
  }
};

/**
 *
 * @param player1
 * @param gameId
 * @param type
 * @returns
 */
export const createGame = async (
  player1: User,
  gameId: string,
  type: GameType
): Promise<void> => {
  const gameName = `${type} Game #${randomSingleDigit()}${randomSingleDigit()}${randomSingleDigit()}${randomSingleDigit()}`;
  const gameDoc: GameCollectionObject = {
    id: gameId,
    displayName: gameName,
    type,
    player1: player1,
    player2: null,
    createdDate: Timestamp.now(),
    player1ActionNumber: 0,
    player2ActionNumber: 0,
    currentTurn: null,
    actions: [
      {
        type: GameActionType.CREATE_GAME,
        userId: player1.id,
        createdDate: Timestamp.now(),
        metadata: null,
      },
    ],
  };

  try {
    console.log(
      `[api][createGame] creating new game=${JSON.stringify(gameDoc)}`
    );
    return await setDoc(doc(gamesCollection, gameId), gameDoc);
  } catch (e) {
    throw new Error(`Error creating a new game: ${JSON.stringify(e)}`);
  }
};

/**
 *
 * @param gameId
 * @param player1Id
 * @param player2
 * @returns
 */
export const joinGame = async (
  gameId: string,
  player1Id: string,
  player2: User
): Promise<void> => {
  const partialGameDoc = {
    player2: player2,
    currentTurn: Math.random() < 0.5 ? player1Id : player2.id,
    actions: arrayUnion({
      type: GameActionType.JOIN_GAME,
      userId: player2.id,
      createdDate: Timestamp.now(),
      metadata: null,
    } as GameAction),
  };

  try {
    return await updateDoc(doc(gamesCollection, gameId), partialGameDoc);
  } catch (e) {
    throw new Error(`Error joining game: ${JSON.stringify(e)}`);
  }
};

/**
 *
 * @param gameId
 * @param action
 * @returns
 */
export const submitTurn = async (
  gameId: string,
  action: GameAction,
  nextTurn: string
): Promise<void> => {
  try {
    return await updateDoc(doc(gamesCollection, gameId), {
      currentTurn: nextTurn,
      actions: arrayUnion(action),
    });
  } catch (e) {
    throw new Error(`Error adding game action: ${JSON.stringify(e)}`);
  }
};
