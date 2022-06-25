import { CellData, CellType } from "../types";

export const CELL_LEN = 9;
export const WALL_LEN = 8;
export const WIDTH = CELL_LEN + WALL_LEN;

export const initializeGameboardFlattened = (): CellData[] => {
  return Array(WIDTH)
    .fill(0)
    .map((x, r) => {
      return Array(WIDTH)
        .fill(0)
        .map((x, c) => {
          return {
            row: r,
            col: c,
            type:
              r % 2 === 1
                ? CellType.WALL
                : c % 2 === 0
                ? CellType.CELL
                : CellType.WALL,
            occupant: null,
          } as CellData;
        });
    }).flat();
};
