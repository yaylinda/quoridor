import { Container, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GameType, UserCollectionObject } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { createGame } from '../../api';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  user: UserCollectionObject,
}

function LandingPage({ user }: LandingPageProps) {

  const navigate = useNavigate();

  /**
   * 
   */
  const startGame = () => {
    const gameId = uuidv4();

    createGame(user, gameId, GameType.Quoridor)
      .then(() => {
        console.log(`navigating to gameId: ${gameId}`);
        navigate(`game/${gameId}`);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <Button variant="contained" color="success" onClick={startGame}>Start New Game</Button>
    </Container>
  );
}

export default LandingPage;