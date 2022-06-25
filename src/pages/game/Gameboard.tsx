import { Box, Button, Container } from "@mui/material";
import produce from "immer";
import { useEffect, useState } from "react";
import { submitTurn } from "../../api";
import { CellData, GameAction, User } from "../../types";
import { applyActionToBoard, initializeGameboard } from "../../utils/gameUtils";
import GameCell from "./GameCell";

interface GameboardProps {
  user: User;
  gameId: string;
  gameActions: GameAction[];
  isPlayer2: boolean;
  isMyTurn: boolean;
  player1Id: string;
  player2Id: string | null;
}

function Gameboard({
  user,
  gameId,
  gameActions,
  isPlayer2,
  isMyTurn,
  player1Id,
  player2Id,
}: GameboardProps) {
  const [board, setBoard] = useState(initializeGameboard());
  // The inclusive index within gameActions to start applying actions from
  const [actionIndex, setActionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  /**
   * Apply game actions to the game board
   */
  useEffect(() => {
    console.log("[Gameboard][useEffect] updating board...");
    setBoard(
      produce(board, (draft) => {
        // gameActions.forEach((action) => {
        //   console.log(`\tapplying action=${action.type}`);
        //   draft = applyActionToBoard(draft, action, isPlayer2, user.id);
        //   console.log(`\tdraft=${JSON.stringify(draft)}`);
        // });
        let startingIndex = isPlayer2 ? 0 : actionIndex;
        gameActions.forEach((action, i) => {
          console.log(`\tapplying action index=${i}`);
          if (i < startingIndex) {
            console.log(
              `\t\taction index=${i} < startingIndex=${startingIndex}... NO-OP`
            );
          } else {
            console.log(
              `\t\taction index=${i}... applying action=${JSON.stringify(
                action
              )}`
            );
            draft = applyActionToBoard(draft, action, isPlayer2);
          }
        });
        return draft;
      })
    );

    setActionIndex(gameActions.length);
  }, [gameActions]);

  const onSubmitTurn = () => {
    setSubmitting(true);
    // submitTurn(gameId)
    //   .then()
    //   .catch()
    //   .finally(() => setSubmitting(false));
  };

  /**
   *
   */
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {board.map((row, i) => (
        <GameRow
          key={`row_${i}`}
          row={row}
          isPlayer2={isPlayer2}
          player1Id={player1Id}
          player2Id={player2Id}
        />
      ))}
      {isMyTurn && (
        <Button
          disabled={submitting || !isValid}
          variant="contained"
          color="success"
          size="large"
          sx={{ marginTop: 5 }}
          onClick={onSubmitTurn}
        >
          {submitting ? "Submitting Turn..." : "Submit Turn"}
        </Button>
      )}
    </Container>
  );
}

interface GameRowProps {
  row: CellData[];
  isPlayer2: boolean;
  player1Id: string;
  player2Id: string | null;
}

/**
 *
 * @param param0
 * @returns
 */
function GameRow({ row, isPlayer2, player1Id, player2Id }: GameRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {row.map((cell) => (
        <GameCell
          key={`row_${cell.row}_col_${cell.col}`}
          cellData={cell}
          isPlayer2={isPlayer2}
          player1Id={player1Id}
          player2Id={player2Id}
        />
      ))}
    </Box>
  );
}

export default Gameboard;
