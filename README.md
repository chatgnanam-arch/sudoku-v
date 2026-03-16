# sudoku-v

Project planning is captured in [BUILD_PLAN.md](./BUILD_PLAN.md).

## Monorepo Scaffold

- `apps/web`: Vite + React shell for the browser app
- `apps/mobile`: Expo React Native shell for iOS and Android
- `packages/game-engine`: shared Sudoku board logic and helpers
- `packages/shared-types`: shared Sudoku constants and type definitions
- `packages/design-tokens`: shared visual tokens for both apps
- `docs`: architecture and product notes

## Getting Started

1. `pnpm install`
2. `pnpm dev:web`
3. `pnpm dev:mobile`

## Notes

- The mobile app currently uses a single Expo entry screen so we can focus on gameplay first and add routing once the core flows are in place.
- The existing `test` file in the repo was left untouched.
