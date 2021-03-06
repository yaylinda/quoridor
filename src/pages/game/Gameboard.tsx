import { Alert, Box, Button, Container, Snackbar } from "@mui/material";
import { Timestamp } from "firebase/firestore/lite";
import produce from "immer";
import { useEffect, useState } from "react";
import { submitTurn } from "../../api";
import {
  CellData,
  CellType,
  Coordinate,
  GameAction,
  GameActionType,
  User,
} from "../../types";
import {
  applyActionToBoard,
  didWin,
  doesWallBlockPath,
  getCoordinate,
  initializeGameboard,
} from "../../utils/gameUtils";
import GameCell from "./GameCell";
import invariant from "invariant";

interface GameboardProps {
  user: User;
  gameId: string;
  gameActions: GameAction[];
  isPlayer2: boolean;
  currentTurn: string | null;
  player1Id: string;
  player2Id: string | null;
  winner: string | null;
  player1Location: Coordinate;
  player2Location: Coordinate | null;
}

function Gameboard({
  user,
  gameId,
  gameActions,
  isPlayer2,
  currentTurn,
  player1Id,
  player2Id,
  winner,
  player1Location,
  player2Location,
}: GameboardProps) {
  const [board, setBoard] = useState(initializeGameboard());
  // The inclusive index within gameActions to start applying actions from
  const [actionIndex, setActionIndex] = useState(0);
  const [clickedCells, setClickedCells] = useState<CellData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showInvalidWallSnackbar, setShowInvalidWallSnackbar] =
    useState<boolean>(false);

  const isMyTurn = user.id === currentTurn;

  /**
   * Apply game actions to the game board
   */
  useEffect(() => {
    console.log("[Gameboard][useEffect] updating board...");
    setBoard(
      produce(board, (draft) => {
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

  /**
   *
   */
  const onSubmitTurn = () => {
    const [cell1, cell2] = clickedCells;

    setSubmitting(true);

    const actionType =
      cell1.type === CellType.CELL
        ? GameActionType.MOVE_PIECE
        : GameActionType.PLACE_WALL;

    const action = {
      type: actionType,
      userId: user.id,
      createdDate: Timestamp.now(),
      metadata: {
        coord1: getCoordinate({ row: cell1.row, col: cell1.col }, isPlayer2),
        coord2: getCoordinate({ row: cell2.row, col: cell2.col }, isPlayer2),
      },
    };

    invariant(player2Id != null, "player2 cannot be null");

    submitTurn(
      gameId,
      action,
      currentTurn === player1Id ? player2Id : player1Id,
      isPlayer2,
      didWin(cell2, actionType)
    )
      .then()
      .catch()
      .finally(() => {
        setSubmitting(false);
        onReset();
      });
  };

  /**
   *
   */
  const onReset = () => {
    setClickedCells([]);
  };

  /**
   *
   * @param cellData
   * @returns
   */
  const onUpdateClickedCells = (cellData: CellData) => {
    invariant(player2Location, "player2Location cannot be null");

    if (
      doesWallBlockPath(
        cellData,
        player1Location,
        player2Location,
        board,
        isPlayer2
      )
    ) {
      setShowInvalidWallSnackbar(true);
      return;
    }

    setClickedCells(
      produce(clickedCells, (draft) => {
        draft.push(cellData);
        return draft;
      })
    );
  };

  /**
   *
   * @returns
   */
  const renderButtonRow = () => {
    if (!isMyTurn) {
      return null;
    }

    return (
      <Box sx={{ marginTop: 5 }}>
        <Button
          disabled={clickedCells.length === 0}
          variant="outlined"
          size="large"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          disabled={submitting || clickedCells.length !== 2}
          variant="contained"
          color="success"
          size="large"
          onClick={onSubmitTurn}
        >
          {submitting ? "Submitting Turn..." : "Submit Turn"}
        </Button>
      </Box>
    );
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
        <Box
          key={`row${i}`}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {row.map((cell) => (
            <GameCell
              key={cell.id}
              board={board}
              cellData={cell}
              isPlayer2={isPlayer2}
              isMyTurn={isMyTurn}
              userId={user.id}
              player1Id={player1Id}
              player2Id={player2Id}
              winner={winner}
              clickedCells={clickedCells}
              onClickCell={onUpdateClickedCells}
            />
          ))}
        </Box>
      ))}
      {renderButtonRow()}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showInvalidWallSnackbar}
        onClose={() => setShowInvalidWallSnackbar(false)}
        autoHideDuration={3000}
      >
        <Alert
          onClose={() => setShowInvalidWallSnackbar(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Invalid wall segment placement
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Gameboard;
