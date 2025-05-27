"use client";
import { motion, AnimatePresence } from "framer-motion";

export const LiveActivity = ({ guesses, hideGuessWords = false }) => {
  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Live Activity</h3>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        <AnimatePresence>
          {guesses.length === 0 ? (
            <p className="text-neutral-400 text-center italic text-sm">
              No guesses yet...
            </p>
          ) : (
            guesses.map((guess, index) => (
              <motion.div
                key={`${guess.playerId}-${guess.timestamp}`}
                className={`p-2 rounded-lg text-sm ${
                  guess.isCorrect
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-neutral-800/50 text-neutral-300"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{guess.playerName}</span>
                  {guess.isCorrect && <span className="text-green-400">✓</span>}
                </div>
                
                <div className="text-xs opacity-75">
                  {guess.isCorrect && hideGuessWords
                    ? "guessed the word!"
                    : `"${guess.guess}"`}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};