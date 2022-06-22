import { AppBar, Toolbar, Typography } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { usersCollection } from './api';
import './App.css';
import GamePage from './pages/GamePage';
import LandingPage from './pages/LandingPage';
import { User, UserCollectionObject } from './types';

interface AppProps {
  user: User,
}

function App({ user }: AppProps) {
  const [userDoc, setUserDoc] = useState<UserCollectionObject | null>();

  /**
   * Set up listener on user updates
   */
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const unsub = onSnapshot(doc(usersCollection, user.id), (doc) => setUserDoc(doc.data() as UserCollectionObject));

    return () => {
      unsub();
    }
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Typography variant="h6" component="div">
            Quoridor
          </Typography>
        </Toolbar>
      </AppBar>
      {
        userDoc ? (
          <Routes>
            <Route path="/" element={<LandingPage user={userDoc} />} />
            <Route path="game/:id" element={<GamePage />} />
          </Routes>
        ) : null
      }
    </>
  );
}

export default App;
