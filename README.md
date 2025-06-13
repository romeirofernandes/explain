# Explain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.x-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-blue.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer--Motion-12.x-purple.svg)](https://www.framer.com/motion/)

A real-time, multiplayer word explanation and guessing game. Create a room, invite friends, and play together — powered by Firebase and Next.js.

---

## What is Explain?

**Explain** is a multiplayer party game where one player explains a secret word and others try to guess it as quickly as possible. The platform features:

- Game creation and joining with unique codes
- Real-time gameplay using Firebase Firestore
- Animated, responsive UI with Next.js, Tailwind CSS, and Framer Motion
- Integrated feedback collection via Unified SDK

---

## Project Structure

```

explain/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages (create, join, game, etc.)
│   ├── components/          # Game UI components (lobby, timer, results, etc.)
│   ├── constants/           # Game constants and word lists
│   ├── lib/                 # Firebase config
│   └── utils/               # Game logic helpers
├── .env.local               # Environment variables
├── package.json
├── next.config.mjs
└── README.md

````

---

## Features

- **Create & Join Games**: Instantly start or join a game with a 6-character code
- **Lobby System**: Wait for friends, see who's joined, and configure settings
- **Custom Game Settings**: Choose round time, total rounds, difficulty, and max players
- **Real-Time Gameplay**: All actions sync live via Firebase
- **Explainer & Guesser Roles**: One player explains, others guess
- **Scoreboard & Results**: Live leaderboard and animated round/game results
- **Responsive & Animated UI**: Mobile-friendly, smooth transitions
- **Feedback Widget**: Collect user feedback with Unified SDK

---

## Installation

```bash
git clone https://github.com/romeirofernandes/explain.git
cd explain/explain
pnpm install
````

---

## Environment Variables

Create a `.env.local` file in the project root with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

---

## Usage

```bash
# Start development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Game Flow

1. **Home**: Choose to create or join a game.
2. **Create Game**: Set your name and game settings, get a unique code.
3. **Join Game**: Enter code and your name to join a friend's lobby.
4. **Lobby**: Wait for all players, then start the game.
5. **Gameplay**: One player explains, others guess the word.
6. **Round Results**: See who scored; leaderboard updates.
7. **Game Results**: Final scores and winner displayed.

---

## Tech Stack

* **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
* **Backend**: Firebase Firestore (real-time database)
* **Feedback**: Unified SDK
* **Deployment**: Vercel (recommended)

---

## Key Components

* **GameLobby**: Player list, settings, start game button
* **GamePlay**: Explainer and guesser sections, timer, live activity
* **RoundResults**: Animated round summary and leaderboard
* **GameResults**: Final scores and winner
* **UnifiedFeedback**: Feedback widget on home page

---

## Development Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Lint code
pnpm lint

# Build for production
pnpm build
```

---

## Browser Support

* Chrome 90+
* Firefox 88+
* Safari 14+
* Edge 90+

---

## Support

* **Issues**: [GitHub Issues](https://github.com/romeirofernandes/explain/issues)
* **Feedback**: Use the in-app feedback widget

---

## License

MIT License — see [LICENSE](LICENSE) file for details.
