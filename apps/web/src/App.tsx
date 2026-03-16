import type { CSSProperties } from "react";
import { colors, radii, shadows, spacing } from "@sudoku-v/design-tokens";
import { countFilledCells, hydrateBoard } from "@sudoku-v/game-engine";
import { BOARD_SIZE } from "@sudoku-v/shared-types";

const previewBoard = hydrateBoard(
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
);

const filledCellCount = countFilledCells(previewBoard);

const shellStyle = {
  "--color-accent": colors.accent,
  "--color-accent-soft": colors.accentSoft,
  "--color-border": colors.border,
  "--color-canvas": colors.canvas,
  "--color-ink": colors.ink,
  "--color-muted": colors.muted,
  "--color-surface": colors.surface,
  "--radius-card": `${radii.lg}px`,
  "--radius-cell": `${radii.sm}px`,
  "--shadow-card": shadows.card,
  "--space-lg": `${spacing.lg}px`,
  "--space-md": `${spacing.md}px`,
  "--space-sm": `${spacing.sm}px`,
  "--space-xl": `${spacing.xl}px`
} as CSSProperties;

function App() {
  return (
    <main className="shell" style={shellStyle}>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Monorepo scaffold</p>
          <h1>Sudoku V is ready for web and mobile implementation.</h1>
          <p className="lede">
            The workspace already shares Sudoku domain logic, design tokens, and
            runtime types across a dedicated web shell and a mobile Expo app.
          </p>
          <div className="pill-row">
            <span className="pill">81 cells wired up</span>
            <span className="pill">{filledCellCount} givens in preview puzzle</span>
            <span className="pill">{BOARD_SIZE}x{BOARD_SIZE} board foundation</span>
          </div>
        </div>

        <div className="board-card" aria-label="Sudoku preview board">
          <div className="board">
            {previewBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const className = [
                  "cell",
                  cell.value === null ? "empty" : "filled",
                  (colIndex + 1) % 3 === 0 && colIndex !== BOARD_SIZE - 1
                    ? "box-right"
                    : "",
                  (rowIndex + 1) % 3 === 0 && rowIndex !== BOARD_SIZE - 1
                    ? "box-bottom"
                    : ""
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div className={className} key={`${rowIndex}-${colIndex}`}>
                    {cell.value ?? ""}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="grid two-up">
        <article className="panel">
          <h2>Apps</h2>
          <ul>
            <li>`apps/web`: Vite + React shell for browser delivery</li>
            <li>`apps/mobile`: Expo React Native shell for iOS and Android</li>
          </ul>
        </article>

        <article className="panel">
          <h2>Shared packages</h2>
          <ul>
            <li>`packages/game-engine`: board state, validation, serialization</li>
            <li>`packages/shared-types`: shared constants and Sudoku types</li>
            <li>`packages/design-tokens`: colors, spacing, radii, shadows</li>
          </ul>
        </article>
      </section>

      <section className="panel">
        <h2>Recommended next build steps</h2>
        <ol>
          <li>Implement move history, notes mode, and conflict highlighting in the game engine.</li>
          <li>Replace this preview with a real game board and play controls in both apps.</li>
          <li>Layer in persistence, stats, and difficulty-driven puzzle loading.</li>
        </ol>
      </section>
    </main>
  );
}

export default App;

