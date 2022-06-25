import { CellData, CellType } from "../types";

export const CELL_LEN = 9;
export const WALL_LEN = 8;
export const WIDTH = CELL_LEN + WALL_LEN;

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
          } as CellData;
        });
    });
};
