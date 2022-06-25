import { Box, Container, Typography } from "@mui/material";
import { chunk } from "lodash";
import { useEffect, useState } from "react";
import {
  CellData,
  CellType,
  GameAction,
  GameCollectionObject,
  User,
} from "../../types";
import {
  applyActionToBoard,
  initializeGameboard,
  WIDTH,
} from "../../utils/gameUtils";
import produce from "immer";

const CELL_SIZE = 60;
const WALL_SIZE = 20;

interface GameboardProps {
  user: User;
  gameActions: GameAction[];
}

function Gameboard({ user, gameActions }: GameboardProps) {
  const [board, setBoard] = useState(initializeGameboard());
  // The inclusive index within gameActions to start applying actions from
  const [actionIndex, setActionIndex] = useState(0);

  /**
   * Apply game actions to the game board
   */
  useEffect(() => {
    console.log("[Gameboard][useEffect] updating board...");
    setBoard(
      produce(board, (draft) => {
        let startingIndex = actionIndex;
        gameActions.forEach((action, i) => {
          console.log(`\tapplying action index=${i}`);
          if (i < startingIndex) {
            console.log(
              `\t\taction index=${i} < startingIndex=${startingIndex}... NO-OP`
            );
          } else {
            console.log(`\t\taction index=${i}... applying action=${action}`);
            draft = applyActionToBoard(draft, action);
          }
          startingIndex++;
        });
        return draft;
      })
    );
    setActionIndex(gameActions.length);
  }, [gameActions]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {board.map((row, i) => (
        <GameRow key={`row_${i}`} row={row} />
      ))}
    </Container>
  );
}

/**
 *
 * @param param0
 * @returns
 */
function GameCell({ cellData }: { cellData: CellData }) {
  const getWidth = () => {
    switch (cellData.type) {
      case CellType.CELL:
        return CELL_SIZE;
      case CellType.BLANK:
        return WALL_SIZE;
      case CellType.WALL:
        return cellData.row % 2 === 0 ? WALL_SIZE : CELL_SIZE;
      default:
        return 0;
    }
  };

  const getHeight = () => {
    switch (cellData.type) {
      case CellType.CELL:
        return CELL_SIZE;
      case CellType.BLANK:
        return WALL_SIZE;
      case CellType.WALL:
        return cellData.row % 2 === 1 ? WALL_SIZE : CELL_SIZE;
      default:
        return 0;
    }
  };

  const getBackgroundColor = () => {
    switch (cellData.type) {
      case CellType.CELL:
        return "lightcyan";
      case CellType.BLANK:
        return "white";
      case CellType.WALL:
        return cellData.isWall ? "brown" : "white";
    }
  };

  const getBorderRadius = () => {
    switch (cellData.type) {
      case CellType.CELL:
        return 2;
      case CellType.WALL:
        return 1;
      default:
        return 0;
    }
  };

  const getBorder = () => {
    switch (cellData.type) {
      default:
        return 2;
    }
  };

  const getBorderColor = () => {
    switch (cellData.type) {
      case CellType.CELL:
        return "dodgerblue";
      case CellType.WALL:
        return "brown";
      default:
        return "white";
    }
  };

  const getMargin = (index: number) => {
    return index + 1 === WIDTH ? 0 : 1;
  };

  const getHoverCursor = () => {
    if (cellData.type === CellType.BLANK) {
      return "default";
    }
    return "pointer";
  };

  return (
    <Box
      sx={{
        width: getWidth(),
        height: getHeight(),
        backgroundColor: getBackgroundColor(),
        borderRadius: getBorderRadius(),
        border: getBorder(),
        borderColor: getBorderColor(),
        marginRight: getMargin(cellData.col),
        marginBottom: getMargin(cellData.row),
        "&:hover": {
          cursor: getHoverCursor(),
          opacity: 0.8,
        },
      }}
    ></Box>
  );
}

/**
 *
 * @param param0
 * @returns
 */
function GameRow({ row }: { row: CellData[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {row.map((cell) => (
        <GameCell key={`row_${cell.row}_col_${cell.col}`} cellData={cell} />
      ))}
    </Box>
  );
}

export default Gameboard;
