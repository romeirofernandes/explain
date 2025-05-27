"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const ExplainerSection = ({
  currentWord,
  currentClue,
  onUpdateClue,
  roundStarted,
}) => {
  const [localClue, setLocalClue] = useState(currentClue);
  const [error, setError] = useState("");

  // Sync with remote clue updates
  useEffect(() => {
    setLocalClue(currentClue);
  }, [currentClue]);

  const handleClueChange = (e) => {
    setLocalClue(e.target.value);
    setError("");
  };

  const handleClueUpdate = async () => {
    const result = await onUpdateClue(localClue);
    if (!result.success) {
      setError(result.error);
    }
  };

  // Auto-save clue after user stops typing
  useEffect(() => {
    if (localClue === currentClue) return;

    const timer = setTimeout(() => {
      handleClueUpdate();
    }, 1000);

    return () => clearTimeout(timer);
  }, [localClue, currentClue]);

  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your word is:</h2>
        <motion.div
          className="text-4xl font-bold text-[#03624c] mb-6 p-4 bg-neutral-800/50 rounded-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {currentWord}
        </motion.div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Give a clue:</h3>

        <div>
          <textarea
            value={localClue}
            onChange={handleClueChange}
            placeholder="Type a helpful clue that describes the word..."
            className="w-full h-32 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent resize-none"
            disabled={!roundStarted}
          />

          {error && (
            <motion.p
              className="text-red-400 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="text-neutral-400 text-sm space-y-1">
          <p>• Don't use the word itself or its letters</p>
          <p>• Be creative with your descriptions</p>
          <p>• You can edit your clue anytime during the round</p>
          <p>• Changes are saved automatically</p>
        </div>

        {currentClue && (
          <div className="mt-6 p-4 bg-[#03624c]/10 border border-[#03624c]/20 rounded-xl">
            <h4 className="text-white font-medium mb-2">Players see:</h4>
            <p className="text-white italic">"{currentClue}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
