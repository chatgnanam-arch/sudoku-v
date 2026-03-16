import {
  BOARD_SIZE,
  type CellCoordinate,
  type CellValue,
  DIGITS,
  type MaybeCellValue,
  type SudokuBoard,
  type SudokuCell,
  isCellValue
} from "@sudoku-v/shared-types";

function createCell(overrides: Partial<SudokuCell> = {}): SudokuCell {
  return {
    value: null,
    notes: [],
    given: false,
    ...overrides,
    notes: [...(overrides.notes ?? [])].sort((left, right) => left - right)
  };
}

function assertCoordinate(row: number, col: number) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    throw new Error(`Cell coordinate out of bounds: (${row}, ${col})`);
  }
}

function getBoxStart(index: number) {
  return Math.floor(index / 3) * 3;
}

function getCell(board: SudokuBoard, row: number, col: number): SudokuCell {
  assertCoordinate(row, col);

  const candidate = board[row]?.[col];

  if (!candidate) {
    throw new Error(`Missing cell at coordinate (${row}, ${col})`);
  }

  return candidate;
}

export function createEmptyBoard(): SudokuBoard {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => createCell())
  );
}

export function cloneBoard(board: SudokuBoard): SudokuBoard {
  return board.map((row) => row.map((cell) => createCell(cell)));
}

export function hydrateBoard(serializedBoard: string): SudokuBoard {
  const normalized = serializedBoard.replace(/\s/g, "");

  if (normalized.length !== BOARD_SIZE * BOARD_SIZE) {
    throw new Error("Sudoku board must contain exactly 81 characters.");
  }

  const board = createEmptyBoard();

  normalized.split("").forEach((character, index) => {
    if (character === "0" || character === ".") {
      return;
    }

    const digit = Number(character);

    if (!isCellValue(digit)) {
      throw new Error(`Invalid Sudoku digit "${character}" at index ${index}.`);
    }

    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;

    const boardRow = board[row];

    if (!boardRow) {
      throw new Error(`Missing row ${row} while hydrating board.`);
    }

    boardRow[col] = createCell({
      value: digit,
      given: true
    });
  });

  return board;
}

export function serializeBoard(board: SudokuBoard): string {
  return board
    .flat()
    .map((cell) => (cell.value === null ? "0" : String(cell.value)))
    .join("");
}

export function countFilledCells(board: SudokuBoard): number {
  return board.flat().filter((cell) => cell.value !== null).length;
}

export function isValidPlacement(
  board: SudokuBoard,
  row: number,
  col: number,
  value: CellValue
): boolean {
  assertCoordinate(row, col);

  for (let currentCol = 0; currentCol < BOARD_SIZE; currentCol += 1) {
    if (currentCol !== col && getCell(board, row, currentCol).value === value) {
      return false;
    }
  }

  for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow += 1) {
    if (currentRow !== row && getCell(board, currentRow, col).value === value) {
      return false;
    }
  }

  const boxRowStart = getBoxStart(row);
  const boxColStart = getBoxStart(col);

  for (let currentRow = boxRowStart; currentRow < boxRowStart + 3; currentRow += 1) {
    for (let currentCol = boxColStart; currentCol < boxColStart + 3; currentCol += 1) {
      if (currentRow === row && currentCol === col) {
        continue;
      }

      if (getCell(board, currentRow, currentCol).value === value) {
        return false;
      }
    }
  }

  return true;
}

export function setCellValue(
  board: SudokuBoard,
  row: number,
  col: number,
  nextValue: MaybeCellValue
): SudokuBoard {
  assertCoordinate(row, col);

  const nextBoard = cloneBoard(board);
  const targetCell = getCell(nextBoard, row, col);

  if (targetCell.given) {
    return nextBoard;
  }

  targetCell.value = nextValue;

  if (nextValue !== null) {
    targetCell.notes = [];
  }

  return nextBoard;
}

export function toggleCellNote(
  board: SudokuBoard,
  row: number,
  col: number,
  note: CellValue
): SudokuBoard {
  assertCoordinate(row, col);

  const nextBoard = cloneBoard(board);
  const targetCell = getCell(nextBoard, row, col);

  if (targetCell.given || targetCell.value !== null) {
    return nextBoard;
  }

  if (targetCell.notes.includes(note)) {
    targetCell.notes = targetCell.notes.filter((item) => item !== note);
  } else {
    targetCell.notes = [...targetCell.notes, note].sort((left, right) => left - right);
  }

  return nextBoard;
}

export function findConflicts(
  board: SudokuBoard,
  row: number,
  col: number
): CellCoordinate[] {
  assertCoordinate(row, col);

  const value = getCell(board, row, col).value;

  if (value === null) {
    return [];
  }

  const conflicts = new Map<string, CellCoordinate>();

  for (let currentCol = 0; currentCol < BOARD_SIZE; currentCol += 1) {
    if (currentCol !== col && getCell(board, row, currentCol).value === value) {
      conflicts.set(`${row}-${currentCol}`, { row, col: currentCol });
    }
  }

  for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow += 1) {
    if (currentRow !== row && getCell(board, currentRow, col).value === value) {
      conflicts.set(`${currentRow}-${col}`, { row: currentRow, col });
    }
  }

  const boxRowStart = getBoxStart(row);
  const boxColStart = getBoxStart(col);

  for (let currentRow = boxRowStart; currentRow < boxRowStart + 3; currentRow += 1) {
    for (let currentCol = boxColStart; currentCol < boxColStart + 3; currentCol += 1) {
      if (currentRow === row && currentCol === col) {
        continue;
      }

      if (getCell(board, currentRow, currentCol).value === value) {
        conflicts.set(`${currentRow}-${currentCol}`, {
          row: currentRow,
          col: currentCol
        });
      }
    }
  }

  return [...conflicts.values()];
}

export function clearBoardValues(board: SudokuBoard): SudokuBoard {
  return board.map((row) =>
    row.map((cell) =>
      cell.given
        ? createCell(cell)
        : createCell({
            value: null,
            notes: [],
            given: false
          })
    )
  );
}

export function getAllowedValues(
  board: SudokuBoard,
  row: number,
  col: number
): CellValue[] {
  assertCoordinate(row, col);

  if (getCell(board, row, col).value !== null) {
    return [];
  }

  return DIGITS.filter((digit) => isValidPlacement(board, row, col, digit));
}
