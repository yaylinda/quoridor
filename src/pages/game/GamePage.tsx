import { PlayArrow } from "@mui/icons-material";
import {
  Container,
  Typography,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";
import { onSnapshot, doc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gamesCollection } from "../../api";
import { GameCollectionObject, UserCollectionObject } from "../../types";
import Gameboard from "./Gameboard";

interface UserPageProps {
  user: UserCollectionObject;
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

    const unsub = onSnapshot(doc(gamesCollection, gameId), (doc) => {
      setGame(doc.data() as GameCollectionObject);
      console.log(
        `[GamePage][useEffect][onSnapshot] updating game from firestore`
      );
    });

    return () => {
      unsub();
    };
  }, [gameId]);

  /**
   *
   */
  const renderStatus = () => {
    if (!game) {
      return null;
    }

    let color;
    let text;

    if (!game.player2) {
      color = "orange";
      text = "WAITING FOR PLAYER 2";
    } else if (game.currentTurn === user.id) {
      color = "green";
      text = "YOUR TURN";
    } else {
      color = "gray";
      text = "OPPONENT'S TURN";
    }

    return (
      <Typography
        variant="h6"
        sx={{
          color,
          marginTop: 2,
          marginBottom: 4,
          fontWeight: "bold",
        }}
      >
        {text}
      </Typography>
    );
  };

  /**
   *
   * @returns
   */
  const renderContent = () => {
    if (!game) {
      return <LinearProgress />;
    }

    return (
      <>
        <Typography variant="h4" sx={{ textAlign: "center", marginTop: 10 }}>
          {game.displayName}
        </Typography>
        <Typography variant="overline">
          Created {moment(game.createdDate.seconds, "X").fromNow()}
        </Typography>
        {renderStatus()}
        <Gameboard game={game} user={user} />
        {!game.player2 && game.player1.id !== user.id && (
          <Button
            startIcon={<PlayArrow />}
            variant="contained"
            color="success"
            size="large"
            sx={{ marginTop: 5 }}
          >
            Join Game
          </Button>
        )}
      </>
    );
  };

  /**
   *
   */
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {renderContent()}
    </Container>
  );
}

export default GamePage;
