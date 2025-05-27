"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function JoinGamePage() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinGame = async (e) => {
    e.preventDefault();
    setError("");

    if (!gameCode.trim() || !playerName.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (gameCode.length !== 6) {
      setError("Game code must be 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Check if game exists
      const gameRef = doc(db, "games", gameCode.toUpperCase());
      const gameSnap = await getDoc(gameRef);

      if (!gameSnap.exists()) {
        setError("Game not found. Please check the game code.");
        setIsLoading(false);
        return;
      }

      const gameData = gameSnap.data();

      // Check if game is already started
      if (gameData.status === "started") {
        setError("This game has already started.");
        setIsLoading(false);
        return;
      }

      // Check if game is full
      if (gameData.players && gameData.players.length >= gameData.maxPlayers) {
        setError("This game is full.");
        setIsLoading(false);
        return;
      }

      // Check if player name already exists
      if (
        gameData.players &&
        gameData.players.some(
          (player) =>
            player.name.toLowerCase() === playerName.trim().toLowerCase()
        )
      ) {
        setError("A player with this name already exists in the game.");
        setIsLoading(false);
        return;
      }

      // Add player to game
      const newPlayer = {
        id: Date.now().toString(),
        name: playerName.trim(),
        score: 0,
        isHost: false,
        joinedAt: new Date().toISOString(),
      };

      await updateDoc(gameRef, {
        players: arrayUnion(newPlayer),
      });

      // Navigate to game lobby
      router.push(
        `/game/${gameCode.toUpperCase()}?player=${encodeURIComponent(
          playerName.trim()
        )}`
      );
    } catch (error) {
      console.error("Error joining game:", error);
      setError("Failed to join game. Please try again.");
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
        <motion.div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
              Join Game
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Enter your game code and name to join
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
          <form onSubmit={handleJoinGame} className="space-y-4 sm:space-y-6">
            {/* Game Code Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="gameCode"
                className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 sm:mb-3"
              >
                Game Code
              </label>
              <motion.input
                type="text"
                id="gameCode"
                value={gameCode}
                onChange={(e) =>
                  setGameCode(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                  )
                }
                placeholder="ABC123"
                maxLength={6}
                className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent transition-all duration-200 tracking-wider font-mono text-left text-base sm:text-lg"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Player Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="playerName"
                className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 sm:mb-3"
              >
                Your Name
              </label>
              <motion.input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent transition-all duration-200"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Join Button */}
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
                  Joining...
                </motion.div>
              ) : (
                "Join Game"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="flex items-center my-4 sm:my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
            transition={{ delay: 0.7 }}
          >
            Back to Home
          </motion.button>

          {/* Help Text */}
          <motion.p
            className="text-xs text-neutral-500 text-center mt-4 sm:mt-6 leading-relaxed px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Ask the game host for the 6-digit game code to join their session.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
