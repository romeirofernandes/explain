# AGENTS.md

## Scope and Working Directory
- The actual app is in `explain/` (nested folder). Run install/dev/lint/build commands there, not from repo root.
- Repo root mostly contains meta tooling (`.agents/`, `skills-lock.json`) and top-level docs.

## Tooling and Commands (verified)
- Package manager used in docs is `pnpm` (`README.md`); app scripts are in `explain/package.json`.
- Main commands (from `explain/`): `pnpm dev`, `pnpm lint`, `pnpm build`, `pnpm start`.
- There is no `test` script configured right now.
- Build does **not** fail on ESLint issues (`explain/next.config.mjs` sets `eslint.ignoreDuringBuilds: true`), so run `pnpm lint` explicitly when validating changes.

## Architecture (high-signal map)
- Next.js App Router app (React 19) with client-heavy pages for gameplay state.
- Route flow:
  - Home: `explain/src/app/page.js`
  - Create game: `explain/src/app/create/page.js`
  - Join game: `explain/src/app/join/page.js`
  - Game room: `explain/src/app/game/[gameCode]/page.js`
- Game room page subscribes to Firestore and switches UI by `gameData.status`:
  - `lobby` -> `GameLobby`
  - `playing` -> `GamePlay`
  - `finished` -> `GameResults`

## Firebase / Data Model Gotchas
- Firebase config is client-side from `NEXT_PUBLIC_FIREBASE_*` env vars in `explain/src/lib/firebase.js`; missing env values break runtime behavior.
- Game identity is URL-query based (`?player=...&host=true`), not auth-based. Preserve this flow unless intentionally redesigning.
- Canonical game settings are nested under `gameData.settings` (for example `settings.maxPlayers`, `settings.roundTime`, `settings.totalRounds`, `settings.difficulty`).
- Status values used across core flow are `lobby`, `playing`, `finished`.

## Conventions That Affect Edits
- JS-only codebase with `@/*` alias to `explain/src/*` (`explain/jsconfig.json`).
- Tailwind is configured via PostCSS plugin only (`explain/postcss.config.mjs` with `@tailwindcss/postcss`); no separate Tailwind config file present.
- Keep `"use client"` boundaries intact for interactive game pages/components that use hooks, router, or Firestore listeners.

## Practical Verification
- Minimum meaningful check after code edits: `pnpm lint` and (for runtime changes) `pnpm build` from `explain/`.
- If a change touches multiplayer/gameplay flow, manually verify create -> join -> lobby -> playing transition using two browser sessions.
