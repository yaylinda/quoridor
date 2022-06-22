import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { addUser } from './api';
import './App.css';
import { generateCookie, QUORIDOR_APP_COOKIE } from './constants';
import { UserCollectionObject } from './types';
import {usersCollection} from './api';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([QUORIDOR_APP_COOKIE]);
  const [cookieId, setCookieId] = useState<string>('');
  const [user, setUser] = useState<UserCollectionObject | null>();

  /**
   * Set up listener on user updates
   */
  useEffect(() => {
    if (!cookieId) {
      return;
    }

    const unsub = onSnapshot(doc(usersCollection, cookieId), (doc) => setUser(doc.data() as UserCollectionObject));

    return () => {
      unsub();
    }
  }, []);
  
  /**
   * Get or set the cookieId. If generating a new one, add a new user to the database.
   */
  useEffect(() => {
    if (cookies?.QUORIDOR_APP_COOKIE) {
      setCookieId(cookies.QUORIDOR_APP_COOKIE);
    } else {
      const cookie = generateCookie();
      setCookie(QUORIDOR_APP_COOKIE, cookie);
      setCookieId(cookie);
      addUser(cookie);
    }
  }, [cookies]);

  return (
    <div className="App">
    </div>
  );
}

export default App;
