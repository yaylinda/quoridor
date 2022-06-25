import { Add, Loop, PlayArrow } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createGame } from "../../api";
import { GameType, UserCollectionObject } from "../../types";

interface LandingPageProps {
  user: UserCollectionObject;
}

function LandingPage({ user }: LandingPageProps) {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  /**
   *
   */
  const onCreateGame = () => {
    setCreating(true);
    const gameId = uuidv4();

    createGame(user, gameId, GameType.Quoridor)
      .then(() => {
        console.log(`navigating to gameId: ${gameId}`);
        navigate(`game/${gameId}`);
      })
      .catch((e) => {
        // TODO - show alert or something to user
        console.error(e);
      });
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Button
        startIcon={creating ? <Loop /> : <Add />}
        disabled={creating}
        variant="contained"
        color="success"
        size="large"
        onClick={onCreateGame}
      >
        {creating ? "Creating..." : "New Game"}
      </Button>
    </Container>
  );
}

export default LandingPage;
