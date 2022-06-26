import { Box, Button, Container } from "@mui/material";
import { Timestamp } from "firebase/firestore/lite";
import produce from "immer";
import { useEffect, useState } from "react";
import { submitTurn } from "../../api";
import {
  CellData,
  CellType,
  GameAction,
  GameActionType,
  User,
} from "../../types";
import {
  applyActionToBoard,
  getCoordinate,
  initializeGameboard,
} from "../../utils/gameUtils";
import GameCell from "./GameCell";

interface GameboardProps {
  user: User;
  gameId: string;
  gameActions: GameAction[];
  isPlayer2: boolean;
  currentTurn: string | null;
  player1Id: string;
  player2Id: string | null;
}

function Gameboard({
  user,
  gameId,
  gameActions,
  isPlayer2,
  currentTurn,
  player1Id,
  player2Id,
}: GameboardProps) {
  const [board, setBoard] = useState(initializeGameboard());
  // The inclusive index within gameActions to start applying actions from
  const [actionIndex, setActionIndex] = useState(0);
  const [firstClicked, setFirstClicked] = useState<CellData | null>(null);
  const [secondClicked, setSecondClicked] = useState<CellData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const isMyTurn = user.id === currentTurn;

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

  useEffect(() => {
    setIsValid(firstClicked != null && secondClicked != null);
  }, [firstClicked, secondClicked]);

  /**
   *
   */
  const onSubmitTurn = () => {
    if (!firstClicked || !secondClicked) {
      return;
    }

    setSubmitting(true);

    const action: GameAction = {
      type:
        firstClicked.type === CellType.CELL
          ? GameActionType.MOVE_PIECE
          : GameActionType.PLACE_WALL,
      userId: user.id,
      createdDate: Timestamp.now(),
      metadata: {
        coord1: getCoordinate(
          { row: firstClicked.row, col: firstClicked.col },
          isPlayer2
        ),
        coord2: getCoordinate(
          { row: secondClicked.row, col: secondClicked.col },
          isPlayer2
        ),
      },
    };

    const nextTurn = currentTurn === player1Id ? player2Id : player1Id;

    submitTurn(gameId, action, nextTurn!)
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
    setFirstClicked(null);
    setSecondClicked(null);
  };

  /**
   *
   * @param cellData
   * @returns
   */
  const onSetFirstClick = (cellData: CellData) => {
    setFirstClicked(cellData);
  };

  const onSetSecondClick = (cellData: CellData) => {
    setSecondClicked(cellData);
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
          disabled={!firstClicked}
          variant="outlined"
          size="large"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          disabled={submitting || !isValid}
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
              firstClicked={firstClicked}
              secondClicked={secondClicked}
              onSetFirstClick={onSetFirstClick}
              onSetSecondClick={onSetSecondClick}
            />
          ))}
        </Box>
      ))}
      {renderButtonRow()}
    </Container>
  );
}

export default Gameboard;
