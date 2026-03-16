export const BOARD_SIZE = 9;

export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type CellValue = (typeof DIGITS)[number];

export type MaybeCellValue = CellValue | null;

export type Difficulty = (typeof DIFFICULTIES)[number];

export type EntryMode = "value" | "note";

export interface CellCoordinate {
  row: number;
  col: number;
}

export interface SudokuCell {
  value: MaybeCellValue;
  notes: CellValue[];
  given: boolean;
}

export type SudokuBoard = SudokuCell[][];

export interface SudokuMove {
  position: CellCoordinate;
  mode: EntryMode;
  previousValue: MaybeCellValue;
  nextValue: MaybeCellValue;
}

export function isCellValue(value: number): value is CellValue {
  return DIGITS.includes(value as CellValue);
}

