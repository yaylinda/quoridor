import { Container, Typography, Button, LinearProgress } from '@mui/material';
import { onSnapshot, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gamesCollection } from '../../api';
import { GameCollectionObject, UserCollectionObject } from '../../types';
import Gameboard from './Gameboard';
import './GamePage.css';

interface UserPageProps {
  user: UserCollectionObject,
}

function GamePage({ user }: UserPageProps) {

  const params = useParams();
  const gameId = params.id;

  const [game, setGame] = useState<GameCollectionObject>();

  /**
   * Set up a listener on game updates
   */
  useEffect(() => {
    if (!gameId) {
      return;
    }

    const unsub = onSnapshot(
      doc(gamesCollection, gameId),
      (doc) => setGame(doc.data() as GameCollectionObject));

    return () => {
      unsub();
    }
  }, [gameId]);

  const renderContent = () => {
    if (!game) {
      return (
        <LinearProgress />
      );
    }

    return (
      <Gameboard game={game} user={user}/>
    );
  }

  return (
    <Container className='game_page_container'>
      {renderContent()}
    </Container>
  );
}

export default GamePage;