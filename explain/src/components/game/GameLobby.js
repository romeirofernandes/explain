"use client";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export const GameLobby = ({ gameData, playerName, isHost, gameCode }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = async () => {
    if (!isHost || gameData.players.length < 2) return;
    
    setIsStarting(true);
    try {
      const gameRef = doc(db, "games", gameCode);
      await updateDoc(gameRef, {
        status: "playing",
        "currentRound.number": 1,
        "currentRound.explainerId": gameData.players[0].id,
        "currentRound.status": "waiting",
        lastActivity: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error starting game:", error);
      setIsStarting(false);
    }
  };

  const copyGameCode = () => {
    navigator.clipboard.writeText(gameCode);
    // Add toast notification here
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Game Code Card */}
        <motion.div
          className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 mb-6 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">Game Lobby</h1>
          <p className="text-neutral-400 mb-4">Share this code with friends</p>
          
          <motion.button
            onClick={copyGameCode}
            className="text-4xl font-mono font-bold text-[#03624c] hover:text-[#06302b] transition-colors mb-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {gameCode}
          </motion.button>
          
          <p className="text-xs text-neutral-500">Click to copy</p>
        </motion.div>

        {/* Players List */}
        <motion.div
          className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Players ({gameData.players.length}/{gameData.settings.maxPlayers})
            </h2>
            <div className="text-sm text-neutral-400">
              Waiting for {Math.max(2 - gameData.players.length, 0)} more players
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gameData.players.map((player, index) => (
              <motion.div
                key={player.id}
                className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                {player.isHost && (
                  <span className="text-xs bg-[#03624c] text-white px-2 py-1 rounded">
                    HOST
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game Settings */}
        <motion.div
          className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Game Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-neutral-400">Max Players:</span>
              <span className="text-white ml-2">{gameData.settings.maxPlayers}</span>
            </div>
            <div>
              <span className="text-neutral-400">Round Time:</span>
              <span className="text-white ml-2">{gameData.settings.roundTime}s</span>
            </div>
            <div>
              <span className="text-neutral-400">Total Rounds:</span>
              <span className="text-white ml-2">{gameData.settings.totalRounds}</span>
            </div>
            <div>
              <span className="text-neutral-400">Difficulty:</span>
              <span className="text-white ml-2 capitalize">{gameData.settings.difficulty}</span>
            </div>
          </div>
        </motion.div>

        {/* Start Game Button (Host Only) */}
        {isHost && (
          <motion.button
            onClick={handleStartGame}
            disabled={gameData.players.length < 2 || isStarting}
            className="w-full h-12 rounded-xl text-base font-medium text-white shadow-lg"
            style={{
              background: 
                gameData.players.length < 2 || isStarting
                  ? "linear-gradient(135deg, #525252 0%, #404040 100%)"
                  : "linear-gradient(135deg, #03624c 0%, #06302b 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            whileHover={
              gameData.players.length >= 2 && !isStarting
                ? {
                    scale: 1.02,
                    background: "linear-gradient(135deg, #06302b 0%, #03624c 100%)",
                    boxShadow: "0 8px 32px rgba(3, 98, 76, 0.3)",
                  }
                : {}
            }
            whileTap={gameData.players.length >= 2 && !isStarting ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isStarting ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                />
                Starting Game...
              </div>
            ) : gameData.players.length < 2 ? (
              "Need at least 2 players to start"
            ) : (
              "Start Game"
            )}
          </motion.button>
        )}

        {!isHost && (
          <div className="text-center text-neutral-400">
            Waiting for host to start the game...
          </div>
        )}
      </motion.div>
    </div>
  );
};