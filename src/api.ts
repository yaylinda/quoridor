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
import { PLAYER_1_START, PLAYER_2_START } from "./utils/gameUtils";
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
    player1Location: PLAYER_1_START,
    player2Location: null,
    currentTurn: null,
    winner: null,
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
    player2Location: PLAYER_2_START,
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
  nextTurn: string,
  isPlayer2: boolean,
  didWin: boolean
): Promise<void> => {
  try {
    const partialGameDoc: { [x: string]: any } = {
      currentTurn: nextTurn,
      actions: arrayUnion(action),
      winner: didWin ? action.userId : null,
    };

    if (
      action.type === GameActionType.MOVE_PIECE &&
      action.metadata &&
      action.metadata.coord2
    )
      if (isPlayer2) {
        partialGameDoc.player2Location = action.metadata.coord2;
      } else {
        partialGameDoc.player1Location = action.metadata.coord2;
      }

    return await updateDoc(doc(gamesCollection, gameId), partialGameDoc);
  } catch (e) {
    throw new Error(`Error adding game action: ${JSON.stringify(e)}`);
  }
};
