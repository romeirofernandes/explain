"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export const GuesserSection = ({
  explainerName,
  currentClue,
  hasGuessedCorrectly,
  onSubmitGuess,
  roundStarted,
}) => {
  const [guess, setGuess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSubmitGuess = async () => {
    if (!guess.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await onSubmitGuess(guess);

    if (result.success) {
      setLastResult({
        guess: guess,
        isCorrect: result.isCorrect,
        timestamp: Date.now(),
      });
      setGuess("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Clue from {explainerName}:
        </h2>

        <div className="min-h-32 p-4 bg-neutral-800/30 rounded-xl">
          {currentClue ? (
            <motion.p
              className="text-white text-lg italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentClue}
            >
              &ldquo;{currentClue}&rdquo;
            </motion.p>
          ) : (
            <p className="text-neutral-400 text-center italic">
              Waiting for clue...
            </p>
          )}
        </div>
      </div>

      {hasGuessedCorrectly ? (
        <motion.div
          className="text-green-400 text-xl font-semibold text-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          ✅ Correct! Well done!
          <p className="text-sm text-green-300 mt-2">
            Waiting for other players...
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your guess:</h3>

          <div className="flex gap-3">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitGuess()}
              placeholder="Type your guess..."
              className="flex-1 h-12 px-4 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#03624c] focus:border-transparent"
              disabled={!roundStarted || isSubmitting}
            />

            <motion.button
              onClick={handleSubmitGuess}
              disabled={!guess.trim() || !roundStarted || isSubmitting}
              className="px-6 h-12 rounded-xl text-white font-medium"
              style={{
                background:
                  !guess.trim() || !roundStarted || isSubmitting
                    ? "linear-gradient(135deg, #525252 0%, #404040 100%)"
                    : "linear-gradient(135deg, #03624c 0%, #06302b 100%)",
              }}
              whileHover={
                guess.trim() && roundStarted && !isSubmitting
                  ? { scale: 1.05 }
                  : {}
              }
              whileTap={
                guess.trim() && roundStarted && !isSubmitting
                  ? { scale: 0.95 }
                  : {}
              }
            >
              {isSubmitting ? "..." : "Guess"}
            </motion.button>
          </div>

          {lastResult && (
            <motion.div
              className={`p-3 rounded-lg text-sm ${
                lastResult.isCorrect
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={lastResult.timestamp}
            >
              <div className="text-xs opacity-75">
                &ldquo;{lastResult.guess}&rdquo; -{" "}
                {lastResult.isCorrect ? "Correct!" : "Try again!"}
              </div>
            </motion.div>
          )}

          <p className="text-neutral-400 text-sm">
            You can make multiple guesses. Keep trying until you get it right!
          </p>
        </div>
      )}
    </div>
  );
};
