import { getFirestore, collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore/lite';
import { onSnapshot } from "firebase/firestore";
import {app} from './firebase';
import { UserCollectionObject } from './types';

const db = getFirestore(app);

export const usersCollection = collection(db, 'users');
export const gamesCollection = collection(db, 'games');

/**
 * 
 * @param cookieId 
 * @returns 
 */
export const addUser = async (cookieId: string): Promise<UserCollectionObject> => {
    const user: UserCollectionObject = {
        id: cookieId,
        createdDate: Timestamp.now(),
        lastLoginDate: Timestamp.now(),
        games: [],
    };

    // Asynchronously put the user object in firestore
    await setDoc(doc(usersCollection, cookieId), user);

    return user;
}
