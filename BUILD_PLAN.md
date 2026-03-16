# Sudoku App Build Plan

## Objective

Build a polished Sudoku application that ships on:

- Web
- iOS
- Android

The app should feel fast, work offline for core play, and support a strong MVP first, with room for progression features like accounts, leaderboards, and daily challenges.

## Product Direction

### Core user experience

Users should be able to:

- Start a new puzzle quickly
- Choose a difficulty
- Enter numbers and pencil marks easily
- Undo and redo moves
- See mistakes clearly
- Use hints when stuck
- Track time and completion stats
- Resume unfinished puzzles

### MVP scope

Ship these first:

- 9x9 Sudoku gameplay
- Easy, Medium, Hard difficulty levels
- Puzzle generator or curated puzzle library
- Validation rules
- Notes / pencil marks
- Undo / redo
- Timer
- Pause / resume
- Local game save
- Basic statistics
- Responsive web layout
- Mobile-friendly touch interactions
- Offline support for the web app and mobile app

### Phase 2 scope

Add after MVP is stable:

- Daily challenge
- Streaks and achievements
- User accounts and sync across devices
- Leaderboards
- Themes
- Accessibility enhancements beyond MVP baseline
- Ads or premium upgrade

## Recommended Technical Approach

### Recommendation

Use a TypeScript monorepo with:

- `apps/mobile`: Expo React Native app for iOS and Android
- `apps/web`: Next.js or Vite React web app
- `packages/game-engine`: shared Sudoku logic
- `packages/shared-types`: shared types and constants
- `packages/design-tokens`: colors, spacing, typography, motion values

### Why this approach

- Sudoku complexity lives mostly in shared game logic, not backend systems
- Mobile and web need different interaction patterns, especially keyboard and layout behavior
- Shared engine code keeps rules, solving, validation, and puzzle generation consistent
- Separate app shells let us optimize UX for touch on mobile and keyboard/responsive behavior on web

### Alternative

If we want maximum UI code reuse and faster initial delivery, we could use Expo with React Native Web for all three platforms. That is simpler up front, but web polish and SEO flexibility are usually better with a dedicated web app.

## Suggested Architecture

### Frontend

- TypeScript across all apps
- Zustand or Redux Toolkit for game state
- React Query only if backend APIs are added later
- Expo Router for mobile navigation
- Next.js App Router or Vite + React Router for web
- Tailwind CSS or CSS Modules for web styling

### Shared game engine

The shared engine should contain:

- Board model
- Candidate note logic
- Move validation
- Conflict detection
- Hint generation
- Puzzle completion detection
- Puzzle generation or puzzle loading
- Solver for verification and hint support
- Difficulty scoring

### Storage

MVP can be backend-free:

- Web: IndexedDB or localStorage
- Mobile: AsyncStorage or SQLite

If sync is added later:

- Supabase or Firebase for auth, cloud save, and daily challenge data

### Analytics and crash reporting

- PostHog, Firebase Analytics, or Amplitude
- Sentry for crash/error tracking

## Repo Structure

```text
sudoku-v/
  apps/
    mobile/
    web/
  packages/
    game-engine/
    shared-types/
    design-tokens/
  docs/
  package.json
  pnpm-workspace.yaml
  turbo.json
```

## Delivery Plan

### Phase 0: Discovery and setup

Duration: 2 to 4 days

- Confirm MVP scope
- Finalize tech stack
- Define app navigation and screen list
- Define board interaction model for touch and keyboard
- Set up monorepo, linting, formatting, testing, CI
- Establish design tokens and UI foundations

Deliverables:

- Monorepo scaffold
- CI pipeline
- High-level wireframes
- Product backlog

### Phase 1: Shared Sudoku engine

Duration: 1 to 2 weeks

- Implement board representation
- Implement rule validation
- Implement puzzle serialization
- Build solver
- Build hint logic
- Add puzzle generation or import verified puzzle bank
- Add difficulty scoring
- Write unit tests for all engine behavior

Deliverables:

- Reusable engine package
- Test suite covering generation, validation, and hints

### Phase 2: Web MVP

Duration: 1 to 2 weeks

- Build game board UI
- Add number pad and keyboard support
- Add notes mode
- Add undo / redo
- Add timer and statistics
- Add save / resume
- Add installable PWA support
- Add onboarding and settings

Deliverables:

- Fully playable web MVP
- Responsive layout for phone, tablet, and desktop

### Phase 3: Mobile MVP

Duration: 1 to 2 weeks

- Build native-feeling board interaction
- Add haptics, gestures, and touch targets
- Reuse shared engine and state model
- Add offline save/resume
- Add platform-specific settings and notifications groundwork

Deliverables:

- iOS and Android MVP builds via Expo
- Internal test builds for TestFlight and Play Console

### Phase 4: Polish and quality

Duration: 1 week

- Accessibility pass
- Performance tuning
- Empty/error/loading state cleanup
- Analytics instrumentation
- Crash reporting
- Cross-platform QA

Deliverables:

- Release candidate for web, iOS, and Android

### Phase 5: Launch and post-launch

Duration: 3 to 5 days for launch prep, then ongoing

- Create store assets and descriptions
- Configure privacy disclosures
- Finalize monitoring dashboards
- Launch web production deployment
- Submit mobile apps to stores
- Gather early feedback and bug reports

Deliverables:

- Production web app
- Submitted or approved mobile apps
- Post-launch improvement list

## MVP Screen List

- Splash / loading
- Home
- Difficulty selection
- Game board
- Pause modal
- Completion / results
- Statistics
- Settings
- About / help

## Engineering Backlog

### Core gameplay

- Board rendering
- Cell selection
- Digit entry
- Note entry
- Conflict highlighting
- Hint action
- Undo / redo
- New game flow
- Resume game flow

### Data and persistence

- Save current puzzle
- Save timer and move history
- Save settings
- Save aggregate statistics

### Quality

- Unit tests for engine
- Component tests for key UI flows
- End-to-end tests for start, play, finish, resume

## Testing Strategy

- Unit tests: game engine, move validation, solver, difficulty logic
- Integration tests: state transitions and persistence
- E2E tests:
  - Web with Playwright
  - Mobile with Detox or Maestro
- Manual QA on:
  - iPhone
  - Android phone
  - Tablet viewport
  - Desktop browsers

## Accessibility Requirements

Baseline MVP requirements:

- Keyboard navigation on web
- Screen reader labels for controls
- High-contrast conflict states
- Large tap targets on mobile
- Reduced-motion friendly animations

## Performance Goals

- Initial web load under 3 seconds on average mobile network
- Board interactions should feel instant
- Puzzle generation should not block the UI thread
- Resume state should load in under 1 second

## Release Infrastructure

### Web

- Host on Vercel or Netlify
- Enable PWA install support
- Add error monitoring and analytics

### Mobile

- Use Expo EAS Build
- TestFlight for iOS testing
- Play Console internal testing for Android

## Risks and Mitigation

### Puzzle generation quality

Risk:
Generating valid puzzles with stable difficulty levels can take longer than expected.

Mitigation:
Start with a verified puzzle bank or pre-generated sets, then add generation improvements after MVP.

### Cross-platform interaction differences

Risk:
Touch-first and keyboard-first experiences need different UX details.

Mitigation:
Share logic, not every UI component.

### Scope creep

Risk:
Daily challenges, accounts, sync, and monetization can delay launch.

Mitigation:
Keep MVP offline-first and single-player only.

## Recommended Milestone Sequence

1. Approve scope and stack
2. Scaffold monorepo
3. Build and test shared engine
4. Ship playable web MVP
5. Port UI patterns to mobile
6. Run QA and fix platform-specific issues
7. Launch web first or simultaneous launch depending on store readiness

## Suggested 6-Week Schedule for 1 to 2 Developers

### Week 1

- Setup monorepo
- Create design foundation
- Start shared engine

### Week 2

- Complete solver, validation, and persistence model
- Add engine tests

### Week 3

- Build web gameplay loop
- Add stats, save/resume, and PWA behavior

### Week 4

- Build mobile gameplay loop
- Tune touch interaction and state persistence

### Week 5

- Add hints, polish, accessibility, analytics, and crash reporting

### Week 6

- QA, bug fixes, store prep, deployment, launch checklist

## Immediate Next Steps

1. Confirm whether we want a shared-engine monorepo or a single Expo + React Native Web codebase
2. Decide whether MVP includes accounts and sync
3. Create the repo scaffold
4. Implement the shared Sudoku engine first
