"use client";
import { motion } from "framer-motion";

export const GamePlay = ({ gameData, playerName, gameCode }) => {
  const currentPlayer = gameData.players.find((p) => p.name === playerName);
  const explainer = gameData.players.find(
    (p) => p.id === gameData.currentRound.explainerId
  );
  const isExplainer = currentPlayer?.id === gameData.currentRound.explainerId;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
      <motion.div
        className="w-full max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-4">
            Round {gameData.currentRound.number} of{" "}
            {gameData.settings.totalRounds}
          </h1>

          {isExplainer ? (
            <div>
              <p className="text-[#03624c] text-lg mb-4">You are explaining!</p>
              <p className="text-white">
                Game play logic will be implemented here
              </p>
            </div>
          ) : (
            <div>
              <p className="text-white mb-4">
                <span className="text-[#03624c] font-semibold">
                  {explainer?.name}
                </span>{" "}
                is explaining
              </p>
              <p className="text-neutral-400">Listen and guess the word!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
