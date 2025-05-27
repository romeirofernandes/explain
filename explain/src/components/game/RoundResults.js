"use client";
import { motion } from "framer-motion";

export const RoundResults = ({
  roundResults,
  currentRound,
  playerName,
  isGameFinished,
}) => {
  const getPositionEmoji = (index) => {
    switch (index) {
      case 0:
        return "🏆";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${index + 1}`;
    }
  };

  const getScoreColor = (scoreGained) => {
    if (scoreGained > 0) return "text-green-400";
    if (scoreGained === 0) return "text-neutral-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 md:p-8">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Round {currentRound.number} Results
            </h2>

            <motion.div
              className="mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <p className="text-xl md:text-2xl text-[#03624c] font-semibold mb-2">
                Word: &ldquo;{roundResults.word}&rdquo;
              </p>
              <p className="text-neutral-400">
                Explained by{" "}
                <span className="text-white font-medium">
                  {roundResults.explainer}
                </span>
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center items-center gap-6 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[#03624c]">
                  {roundResults.correctGuesses}
                </div>
                <div className="text-neutral-400">Correct Guesses</div>
              </div>
              <div className="w-px h-8 bg-neutral-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#03624c]">
                  {roundResults.explainerPoints}
                </div>
                <div className="text-neutral-400">Explainer Points</div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Round Scores */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Round Performance
              </h3>

              <div className="space-y-3">
                {roundResults.playerResults.map((player, index) => (
                  <motion.div
                    key={player.name}
                    className={`p-4 rounded-xl border transition-all ${
                      player.name === playerName
                        ? "bg-[#03624c]/20 border-[#03624c]/40 shadow-lg"
                        : "bg-neutral-800/50 border-neutral-700/50"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-white font-medium mr-3">
                          {player.name}
                          {player.name === playerName && (
                            <span className="text-[#03624c] ml-1">(You)</span>
                          )}
                        </span>

                        <div className="flex gap-2">
                          {player.wasExplainer && (
                            <span className="text-xs bg-[#03624c] text-white px-2 py-1 rounded-full">
                              EXPLAINER
                            </span>
                          )}
                          {player.guessedCorrectly && !player.wasExplainer && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                              ✓ CORRECT
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${getScoreColor(
                            player.scoreGained
                          )}`}
                        >
                          {player.scoreGained > 0 ? "+" : ""}
                          {player.scoreGained}
                        </div>
                        <div className="text-xs text-neutral-400">points</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Live Rankings */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                Current Leaderboard
              </h3>

              <div className="space-y-3">
                {roundResults.playerResults
                  .sort((a, b) => b.totalScore - a.totalScore)
                  .map((player, index) => (
                    <motion.div
                      key={player.name}
                      className={`p-4 rounded-xl border transition-all ${
                        player.name === playerName
                          ? "bg-[#03624c]/20 border-[#03624c]/40 shadow-lg"
                          : index === 0
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : "bg-neutral-800/50 border-neutral-700/50"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3 min-w-[2.5rem]">
                            {getPositionEmoji(index)}
                          </span>

                          <div>
                            <span className="text-white font-medium">
                              {player.name}
                              {player.name === playerName && (
                                <span className="text-[#03624c] ml-1">
                                  (You)
                                </span>
                              )}
                            </span>
                            {index === 0 && (
                              <div className="text-xs text-yellow-400">
                                Leading
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-white">
                            {player.totalScore}
                          </div>
                          <div className="text-xs text-neutral-400">total</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="text-center mt-8 pt-6 border-t border-neutral-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {isGameFinished ? (
              <div>
                <p className="text-xl text-[#03624c] font-semibold mb-2">
                  🎉 Game Complete! 🎉
                </p>
                <p className="text-neutral-400">
                  Check out the final results...
                </p>
              </div>
            ) : (
              <div>
                <motion.div
                  className="flex items-center justify-center mb-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 border-2 border-[#03624c] border-t-transparent rounded-full"></div>
                </motion.div>
                <p className="text-lg text-white font-medium mb-1">
                  Next round starting soon...
                </p>
                <p className="text-sm text-neutral-400">
                  Get ready for the next challenge!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
