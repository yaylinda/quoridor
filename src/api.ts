import { getFirestore, collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore/lite';
import {app} from './firebase';
import { User, UserCollectionObject } from './types';

const db = getFirestore(app);

export const usersCollection = collection(db, 'users');
export const gamesCollection = collection(db, 'games');

/**
 * 
 * @param user 
 */
export const createUser = async (user: User) => {
    const userDoc: UserCollectionObject = {
        ...user,
        createdDate: Timestamp.now(),
        lastLoginDate: Timestamp.now(),
        games: [],
    };

    // Asynchronously put the user object in firestore
    await setDoc(doc(usersCollection, user.id), userDoc);
}
