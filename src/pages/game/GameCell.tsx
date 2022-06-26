import { Avatar, Box } from "@mui/material";
import { CellData, CellType } from "../../types";
import { isAdjacentCell, isAdjacentWall, WIDTH } from "../../utils/gameUtils";

const CELL_SIZE = 60;
const WALL_SIZE = 20;

interface GameCellProps {
  board: CellData[][];
  cellData: CellData;
  isPlayer2: boolean;
  isMyTurn: boolean;
  userId: string;
  player1Id: string;
  player2Id: string | null;
  firstClicked: CellData | null;
  secondClicked: CellData | null;
  onSetFirstClick: (cellData: CellData) => void;
  onSetSecondClick: (cellData: CellData) => void;
}

/**
 *
 * @param param0
 * @returns
 */
function GameCell({
  board,
  cellData,
  isPlayer2,
  isMyTurn,
  userId,
  player1Id,
  player2Id,
  firstClicked,
  secondClicked,
  onSetFirstClick,
  onSetSecondClick,
}: GameCellProps) {
  const isValidForFirstClick = !(
    !isMyTurn ||
    firstClicked ||
    cellData.type === CellType.BLANK ||
    (cellData.type === CellType.WALL && cellData.isWall) ||
    (cellData.type === CellType.CELL && cellData.occupiedBy !== userId)
  );

  const isValidForSecondClick =
    firstClicked &&
    !secondClicked &&
    cellData.id !== firstClicked.id &&
    firstClicked.type === cellData.type &&
    isAdjacentWall(firstClicked, cellData) &&
    isAdjacentCell(firstClicked, cellData, board);

  const willBeOccupiedByPiece =
    cellData.type === CellType.CELL && cellData.id === secondClicked?.id;

  const willBeVacatedByPiece =
    cellData.type === CellType.CELL &&
    cellData.occupiedBy === userId &&
    secondClicked?.type === CellType.CELL;

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
        if (firstClicked && !isValidForSecondClick && !willBeOccupiedByPiece) {
          return "lightgray";
        }
        return "lightcyan";
      case CellType.BLANK:
        return "white";
      case CellType.WALL:
        if (
          cellData.isWall ||
          firstClicked?.id === cellData.id ||
          secondClicked?.id === cellData.id
        ) {
          return "brown";
        }
        if (firstClicked && !isValidForSecondClick) {
          return "lightgray";
        }
        return "white";
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

  const renderContent = () => {
    if (willBeOccupiedByPiece) {
      // This is the cell that we want to move the piece to when user submits turn
      return (
        <Avatar
          sx={{
            backgroundColor: "green",
          }}
        >
          {isPlayer2 ? "P2" : "P1"}
        </Avatar>
      );
    }

    if (willBeVacatedByPiece) {
      // This is the cell that is currently occupied by the user's piece
      return (
        <Avatar
          sx={{
            backgroundColor: "white",
            borderStyle: "dashed",
            borderColor: "green",
          }}
        ></Avatar>
      );
    }

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

  const onClick = () => {
    if (isValidForFirstClick) {
      onSetFirstClick(cellData);
      return;
    }
    if (isValidForSecondClick) {
      onSetSecondClick(cellData);
      return;
    }
  };

  /**
   *
   */
  return (
    <Box
      onClick={() => onClick()}
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
          cursor:
            isValidForFirstClick || isValidForSecondClick
              ? "pointer"
              : "default",
          opacity: isValidForFirstClick || isValidForSecondClick ? 0.7 : 1,
        },
      }}
    >
      {renderContent()}
    </Box>
  );
}

export default GameCell;
