import {
  CellData,
  CellType,
  Coordinate,
  GameAction,
  GameActionType,
} from "../types";
export const CELL_LEN = 9;
export const WALL_LEN = 8;
export const WIDTH = CELL_LEN + WALL_LEN;

const PLAYER_1_START = { row: WIDTH - 1, col: 8 } as Coordinate; // from the perspective of player 1
const PLAYER_2_START = { row: 0, col: 8 } as Coordinate; // from the perspective of player 1

/**
 *
 * @param row
 * @param col
 * @returns
 */
const getCellType = (row: number, col: number) => {
  if (row % 2 === 0 && col % 2 === 0) {
    return CellType.CELL;
  }

  if (row % 2 === 1 && col % 2 === 1) {
    return CellType.BLANK;
  }

  return CellType.WALL;
};

/**
 *
 * @returns
 */
export const initializeGameboard = (): CellData[][] => {
  return Array(WIDTH)
    .fill(0)
    .map((x, r) => {
      return Array(WIDTH)
        .fill(0)
        .map((x, c) => {
          return {
            id: `r${r}_c${c}`,
            row: r,
            col: c,
            type: getCellType(r, c),
            isWall: false,
            occupiedBy: null,
          } as CellData;
        });
    });
};

/**
 *
 * @param board
 * @param action
 * @returns
 */
export const applyActionToBoard = (
  board: CellData[][],
  action: GameAction,
  isPlayer2: boolean
) => {
  switch (action.type) {
    case GameActionType.CREATE_GAME:
      return putPieceOnBoard(
        board,
        null,
        PLAYER_1_START,
        isPlayer2,
        action.userId
      );
    case GameActionType.JOIN_GAME:
      return putPieceOnBoard(
        board,
        null,
        PLAYER_2_START,
        isPlayer2,
        action.userId
      );
    case GameActionType.MOVE_PIECE:
      if (!action.metadata) {
        throw Error("[applyActionToBoard] MOVE_PIECE requires metadata");
      }
      return putPieceOnBoard(
        board,
        action.metadata.coord1,
        action.metadata.coord2,
        isPlayer2,
        action.userId
      );
    case GameActionType.PLACE_WALL:
      if (!action.metadata) {
        throw Error("[applyActionToBoard] PLACE_WALL requires metadata");
      }
      return putWallOnBoard(
        board,
        action.metadata.coord1,
        action.metadata.coord2,
        isPlayer2
      );
    default:
      return board;
  }
};

/**
 *
 * @param board
 * @param from
 * @param to
 * @param isPlayer2 is this piece being put from the perspective of player 2?
 * @returns
 */
const putPieceOnBoard = (
  board: CellData[][],
  from: Coordinate | null,
  to: Coordinate,
  isPlayer2: boolean,
  playerId: string
) => {
  if (from) {
    const { row, col } = getCoordinate(from, isPlayer2);
    board[row][col].occupiedBy = null;
  }

  const { row, col } = getCoordinate(to, isPlayer2);
  board[row][col].occupiedBy = playerId;

  return board;
};

/**
 *
 * @param board
 * @param coord1
 * @param coord2
 * @returns
 */
const putWallOnBoard = (
  board: CellData[][],
  coord1: Coordinate,
  coord2: Coordinate,
  isPlayer2: boolean
) => {
  [coord1, coord2].forEach((coord) => {
    coord = getCoordinate(coord, isPlayer2);
    board[coord.row][coord.col].isWall = true;
  });
  return board;
};

/**
 * Invert the coordinate if the player is player2
 * @param coordinate
 * @returns
 */
export const getCoordinate = (
  coordinate: Coordinate,
  isPlayer2: boolean
): Coordinate => {
  return {
    row: isPlayer2 ? WIDTH - 1 - coordinate.row : coordinate.row,
    col: isPlayer2 ? WIDTH - 1 - coordinate.col : coordinate.col,
  };
};

export const isAdjacentWall = (otherCell: CellData, thisCell: CellData) => {
  if (otherCell.type !== CellType.WALL) {
    // Don't care; other function will take care of it
    return true;
  }

  if (otherCell.row % 2 === 1) {
    return (
      thisCell.row === otherCell.row &&
      (thisCell.col === otherCell.col + 2 || thisCell.col === otherCell.col - 2)
    );
  }

  if (otherCell.col % 2 === 1) {
    return (
      thisCell.col === otherCell.col &&
      (thisCell.row === otherCell.row + 2 || thisCell.row === otherCell.row - 2)
    );
  }
};

/**
 *
 * @param otherCell
 * @param thisCell
 * @param board
 * @returns
 */
export const isAdjacentCell = (
  otherCell: CellData,
  thisCell: CellData,
  board: CellData[][]
) => {
  if (otherCell.type !== CellType.CELL) {
    // Don't care; other function will take care of it
    return true;
  }

  // In same row?
  if (otherCell.row === thisCell.row) {
    if (
      otherCell.col + 2 === thisCell.col &&
      isEmptyWall(otherCell.row, otherCell.col + 1, board)
    ) {
      return true;
    }
    if (
      otherCell.col - 2 === thisCell.col &&
      isEmptyWall(otherCell.row, otherCell.col - 1, board)
    ) {
      return true;
    }
  }

  // In same col?
  if (otherCell.col === thisCell.col) {
    if (
      otherCell.row + 2 === thisCell.row &&
      isEmptyWall(otherCell.row + 1, otherCell.col, board)
    ) {
      return true;
    }
    if (
      otherCell.row - 2 === thisCell.row &&
      isEmptyWall(otherCell.row - 1, otherCell.col, board)
    ) {
      return true;
    }
  }

  return false;
};

/**
 *
 * @param row
 * @param col
 * @param board
 * @returns
 */
const isEmptyWall = (row: number, col: number, board: CellData[][]) => {
  if (row > board.length - 1 || row < 0) {
    return true;
  }
  if (col > board[row].length - 1 || col < 0) {
    return true;
  }

  return !board[row][col].isWall;
};
