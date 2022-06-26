import { Loop, PlayArrow } from "@mui/icons-material";
import { Button, Container, LinearProgress, Typography } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gamesCollection, joinGame } from "../../api";
import { GameCollectionObject, UserCollectionObject } from "../../types";
import Gameboard from "./Gameboard";

interface UserPageProps {
  user: UserCollectionObject;
}

function GamePage({ user }: UserPageProps) {
  const params = useParams();
  const gameId = params.id;

  const [game, setGame] = useState<GameCollectionObject>();
  const [joining, setJoining] = useState(false);

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
  const onJoinGame = () => {
    if (!game || !gameId) {
      return;
    }

    setJoining(true);

    joinGame(gameId, game.player1.id, user)
      .then(() => {})
      .catch((e) => {
        // TODO - show alert or something to user
        console.error(e);
      })
      .finally(() => {
        setJoining(false);
      });
  };

  /**
   *
   */
  const renderStatus = (isMyTurn: boolean) => {
    if (!game) {
      return null;
    }

    let color;
    let text;

    if (!game.player2) {
      color = "orange";
      text = "WAITING FOR PLAYER 2";
    } else if (isMyTurn) {
      color = "green";
      text = "MY TURN";
    } else if (user.id !== game.player1.id && user.id !== game.player2.id) {
      color = "gray";
      text =
        game.currentTurn === game.player1.id
          ? "PLAYER 1'S TURN"
          : "PLAYER 2'S TURN";
    } else {
      color = "gray";
      text = "OPPONENT'S TURN";
    }

    // TODO - show last updated time and person
    // TODO - show if user is player 1, player 2, or spectator
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

    const isMyTurn = user.id === game.currentTurn;

    return (
      <>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {game.displayName}
        </Typography>
        <Typography variant="overline">
          Created {moment(game.createdDate.seconds, "X").fromNow()}
        </Typography>
        {renderStatus(isMyTurn)}
        <Gameboard
          gameId={game.id}
          gameActions={game.actions}
          user={user}
          isPlayer2={user.id === game.player2?.id}
          currentTurn={game.currentTurn}
          player1Id={game.player1.id}
          player2Id={game.player2?.id || null}
        />
        {!game.player2 && game.player1.id !== user.id && (
          <Button
            disabled={joining}
            startIcon={joining ? <Loop /> : <PlayArrow />}
            variant="contained"
            color="success"
            size="large"
            sx={{ marginTop: 5 }}
            onClick={onJoinGame}
          >
            {joining ? "Joining..." : "Join Game"}
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
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      {renderContent()}
    </Container>
  );
}

export default GamePage;
