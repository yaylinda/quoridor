import { getFirestore, collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore/lite';
import {app} from './firebase';
import { GameActionType, GameCollectionObject, GameType, User, UserCollectionObject } from './types';
import { randomSingleDigit } from './utils/randomInteger';

const db = getFirestore(app);

export const usersCollection = collection(db, 'users');
export const gamesCollection = collection(db, 'games');

/**
 * 
 * @param user 
 */
export const createUser = async (user: User): Promise<void>  => {
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
}

/**
 * 
 * @param user 
 * @param type 
 */
export const createGame = async (user: User, gameId: string, type: GameType): Promise<void> => {
    const gameName = `${user.username}'s ${type} #${randomSingleDigit()}${randomSingleDigit()}${randomSingleDigit()}${randomSingleDigit()}`
    const gameDoc: GameCollectionObject = {
        id: gameId,
        name: gameName,
        type,
        players: [user],
        createdDate: Timestamp.now(),
        actions: [
            {
                type: GameActionType.START_GAME,
                user,
                createdDate: Timestamp.now(),
            }
        ],
    };

    try {
        await setDoc(doc(gamesCollection, gameId), gameDoc);
    } catch(e) {
        throw new Error(`Error creating a new game: ${JSON.stringify(e)}`);
    }
}
