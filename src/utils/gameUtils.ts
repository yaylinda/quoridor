import produce from "immer";
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

export const PLAYER_1_START = { row: WIDTH - 1, col: 8 } as Coordinate; // from the perspective of player 1
export const PLAYER_2_START = { row: 0, col: 8 } as Coordinate; // from the perspective of player 1

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

/**
 *
 * @param otherCell
 * @param thisCell
 * @returns
 */
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
  player1Location: Coordinate,
  player2Location: Coordinate,
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

  // Skip over other pawn

  // Check diagonals

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

const isCellEmpty = (
  row: number,
  col: number,
  player1Location,
  player2Location
) => {
  if (row > board.length - 1 || row < 0) {
    return true;
  }
  if (col > board[row].length - 1 || col < 0) {
    return true;
  }

  return !board[row][col].isWall;
};

/**
 *
 * @param potentialWall
 * @param board
 * @param isPlayer2
 * @returns
 */
export const doesWallBlockPath = (
  potentialWall: CellData,
  player1Location: Coordinate,
  player2Location: Coordinate,
  board: CellData[][],
  isPlayer2: boolean
) => {
  if (potentialWall.type !== CellType.WALL) {
    // We only care if the type is a wall
    return false;
  }

  const potentialBoard = produce(board, (draft) => {
    draft[potentialWall.row][potentialWall.col].isWall = true;
    return draft;
  });

  const canPlayer1ReachOtherSide = canReachLastRow(
    getCoordinate(
      { row: player1Location.row, col: player1Location.col },
      isPlayer2
    ),
    potentialBoard,
    new Set(coordToHash(player1Location.row, player1Location.col)),
    isPlayer2 ? WIDTH - 1 : 0
  );

  const canPlayer2ReachOtherSide = canReachLastRow(
    getCoordinate(
      { row: player2Location.row, col: player2Location.col },
      isPlayer2
    ),
    potentialBoard,
    new Set(coordToHash(player2Location.row, player2Location.col)),
    isPlayer2 ? 0 : WIDTH - 1
  );

  return !(canPlayer1ReachOtherSide && canPlayer2ReachOtherSide);
};

/**
 *
 * @param start
 * @param board
 * @param visited
 * @param lastRowIndex
 * @returns
 */
const canReachLastRow = (
  start: Coordinate,
  board: CellData[][],
  visited: Set<string>,
  lastRowIndex: number
): boolean => {
  visited.add(coordToHash(start.row, start.col));

  if (start.row === lastRowIndex) {
    return true;
  }

  return getNeighbors(start, board, visited)
    .filter((cell) => !visited.has(coordToHash(cell.row, cell.col)))
    .map((cell) => canReachLastRow(cell, board, visited, lastRowIndex))
    .some((x) => x);
};

/**
 *
 * @param start
 * @param board
 * @param visited
 * @returns
 */
const getNeighbors = (
  start: Coordinate,
  board: CellData[][],
  visited: Set<string>
): Coordinate[] => {
  const neighbors: Coordinate[] = [];

  // right
  if (
    isEmptyWall(start.row, start.col + 1, board) &&
    !visited.has(coordToHash(start.row, start.col + 1)) &&
    board[start.row]?.[start.col + 2]
  ) {
    neighbors.push(board[start.row][start.col + 2]);
  }

  // left
  if (
    isEmptyWall(start.row, start.col - 1, board) &&
    !visited.has(coordToHash(start.row, start.col - 1)) &&
    board[start.row]?.[start.col - 2]
  ) {
    neighbors.push(board[start.row][start.col - 2]);
  }

  // up
  if (
    isEmptyWall(start.row + 1, start.col, board) &&
    !visited.has(coordToHash(start.row + 2, start.col)) &&
    board[start.row + 2]?.[start.col]
  ) {
    neighbors.push(board[start.row + 2][start.col]);
  }

  // down
  if (
    isEmptyWall(start.row - 1, start.col, board) &&
    !visited.has(coordToHash(start.row - 2, start.col)) &&
    board[start.row - 2]?.[start.col]
  ) {
    neighbors.push(board[start.row - 2][start.col]);
  }

  return neighbors;
};

const coordToHash = (row: number, col: number) => `${row},${col}`;

export const didWin = (
  cell2: CellData,
  actionType: GameActionType
): boolean => {
  if (actionType !== GameActionType.MOVE_PIECE) {
    return false;
  }

  // cell coordinates are wrt to the current user, so it will always be row 0
  return cell2.row === 0;
};
