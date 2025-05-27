"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateRoomCode } from "@/utils/gameLogic";

export default function CreateGamePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [roundTime, setRoundTime] = useState(60);
  const [totalRounds, setTotalRounds] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateGame = async (e) => {
    e.preventDefault();
    setError("");

    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      // Generate unique room code
      let gameCode;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        gameCode = generateRoomCode();
        attempts++;
      } while (attempts < maxAttempts);

      // Create host player
      const hostPlayer = {
        id: Date.now().toString(),
        name: playerName.trim(),
        score: 0,
        isHost: true,
        isConnected: true,
        joinedAt: new Date().toISOString(),
      };

      // Create game data
      const gameData = {
        gameCode,
        hostId: hostPlayer.id,
        players: [hostPlayer],
        status: "lobby", // lobby, playing, finished
        settings: {
          maxPlayers,
          roundTime,
          totalRounds,
          difficulty,
        },
        currentRound: {
          number: 0,
          explainerId: null,
          word: null,
          startTime: null,
          endTime: null,
          guesses: [],
          status: "waiting", // waiting, active, finished
        },
        rounds: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      // Save to Firestore
      const gameRef = doc(db, "games", gameCode);
      await setDoc(gameRef, gameData);

      // Navigate to game lobby
      router.push(
        `/game/${gameCode}?player=${encodeURIComponent(
          playerName.trim()
        )}&host=true`
      );
    } catch (error) {
      console.error("Error creating game:", error);
      setError("Failed to create game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-neutral-950">
      <motion.div
        className="w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card Container */}
        <motion.div
          className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
              Create Game
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Set up your game and invite friends
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-4 sm:mb-6 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs sm:text-sm text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleCreateGame} className="space-y-4 sm:space-y-6">
            {/* Host Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="playerName"
                className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 sm:mb-3"
              >
                Your Name (Host)
              </label>
              <motion.input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent transition-all duration-200"
                whilefocus={{ scale: 1.01 }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Game Settings */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Max Players */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="maxPlayers"
                  className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 sm:mb-3"
                >
                  Max Players
                </label>
                <motion.div className="relative">
                  <select
                    id="maxPlayers"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                    whilefocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value={4} className="bg-neutral-800 text-white">
                      4 Players
                    </option>
                    <option value={6} className="bg-neutral-800 text-white">
                      6 Players
                    </option>
                    <option value={8} className="bg-neutral-800 text-white">
                      8 Players
                    </option>
                    <option value={10} className="bg-neutral-800 text-white">
                      10 Players
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>

              {/* Round Time */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="roundTime"
                  className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 sm:mb-3"
                >
                  Round Time
                </label>
                <motion.div className="relative">
                  <select
                    id="roundTime"
                    value={roundTime}
                    onChange={(e) => setRoundTime(Number(e.target.value))}
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                    whilefocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value={30} className="bg-neutral-800 text-white">
                      30 sec
                    </option>
                    <option value={45} className="bg-neutral-800 text-white">
                      45 sec
                    </option>
                    <option value={60} className="bg-neutral-800 text-white">
                      60 sec
                    </option>
                    <option value={90} className="bg-neutral-800 text-white">
                      90 sec
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>

              {/* Total Rounds */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label
                  htmlFor="totalRounds"
                  className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 sm:mb-3"
                >
                  Total Rounds
                </label>
                <motion.div className="relative">
                  <select
                    id="totalRounds"
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(Number(e.target.value))}
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                    whilefocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value={3} className="bg-neutral-800 text-white">
                      3 Rounds
                    </option>
                    <option value={5} className="bg-neutral-800 text-white">
                      5 Rounds
                    </option>
                    <option value={7} className="bg-neutral-800 text-white">
                      7 Rounds
                    </option>
                    <option value={10} className="bg-neutral-800 text-white">
                      10 Rounds
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>

              {/* Difficulty */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label
                  htmlFor="difficulty"
                  className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 sm:mb-3"
                >
                  Difficulty
                </label>
                <motion.div className="relative">
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                    whilefocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value="easy" className="bg-neutral-800 text-white">
                      Easy
                    </option>
                    <option
                      value="medium"
                      className="bg-neutral-800 text-white"
                    >
                      Medium
                    </option>
                    <option value="hard" className="bg-neutral-800 text-white">
                      Hard
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Create Game Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium text-white shadow-lg relative overflow-hidden"
              style={{
                background: isLoading
                  ? "linear-gradient(135deg, #525252 0%, #404040 100%)"
                  : "linear-gradient(135deg, #03624c 0%, #06302b 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              whileHover={
                !isLoading
                  ? {
                      scale: 1.02,
                      background:
                        "linear-gradient(135deg, #06302b 0%, #03624c 100%)",
                      boxShadow: "0 8px 32px rgba(3, 98, 76, 0.3)",
                    }
                  : {}
              }
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2 sm:mr-3"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Creating Game...
                </motion.div>
              ) : (
                "Create Game"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="flex items-center my-4 sm:my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex-1 h-px bg-neutral-800"></div>
            <span className="px-3 sm:px-4 text-neutral-500 text-xs sm:text-sm">
              or
            </span>
            <div className="flex-1 h-px bg-neutral-800"></div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            className="w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium text-neutral-300 border border-neutral-700 transition-all duration-200"
            style={{ background: "transparent" }}
            whileHover={{
              scale: 1.02,
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Back to Home
          </motion.button>

          {/* Help Text */}
          <motion.p
            className="text-xs text-neutral-500 text-center mt-4 sm:mt-6 leading-relaxed px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            You&apos;ll be the host and can start the game once other players join
            using your game code.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
