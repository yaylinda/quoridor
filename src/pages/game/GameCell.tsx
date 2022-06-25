import { Avatar, Box } from "@mui/material";
import { CellData, CellType } from "../../types";
import { WIDTH } from "../../utils/gameUtils";

const CELL_SIZE = 60;
const WALL_SIZE = 20;

interface GameCellProps {
  cellData: CellData;
  isPlayer2: boolean;
  player1Id: string;
  player2Id: string | null;
}

/**
 *
 * @param param0
 * @returns
 */
function GameCell({
  cellData,
  isPlayer2,
  player1Id,
  player2Id,
}: GameCellProps) {
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

  const renderContent = () => {
    if (cellData.type !== CellType.CELL || !cellData.occupiedBy) {
      return null;
    }

    let avatarString;
    let avatarColor;
    let occupiedByPlayer2;

    if (cellData.occupiedBy === player1Id) {
      avatarString = "P1";
      avatarColor = "green";
    } else if (cellData.occupiedBy === player2Id) {
      avatarString = "P2";
      avatarColor = "red";
      occupiedByPlayer2 = true;
    }

    if (!avatarString) {
      return null;
    }

    if (isPlayer2 && occupiedByPlayer2) {
      avatarColor = "green";
    } else if (isPlayer2 && !occupiedByPlayer2) {
      avatarColor = "red";
    }

    return (
      <Avatar
        sx={{
          backgroundColor: avatarColor,
        }}
      >
        {avatarString}
      </Avatar>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
    >
      {renderContent()}
    </Box>
  );
}

export default GameCell;
