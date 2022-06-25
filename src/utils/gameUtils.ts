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
    case GameActionType.PLACE_WALL:
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
 * @param coordinate
 * @returns
 */
const getCoordinate = (
  coordinate: Coordinate,
  isPlayer2: boolean
): Coordinate => {
  return {
    row: isPlayer2 ? WIDTH - 1 - coordinate.row : coordinate.row,
    col: isPlayer2 ? WIDTH - 1 - coordinate.col : coordinate.col,
  };
};
