"use client";
import { motion } from "framer-motion";

export const WaitingScreen = ({
  currentRound,
  totalRounds,
  isExplainer,
  explainerName,
}) => {
  const getReadyMessage = () => {
    if (isExplainer) {
      return {
        title: "Get Ready to Explain! 🎯",
        subtitle: "You're about to receive a word to describe",
        tips: [
          "Think creatively about your descriptions",
          "Avoid using the word itself or its letters",
          "You can edit your clue anytime during the round",
          "Help your team guess as quickly as possible!",
        ],
      };
    }

    return {
      title: "Get Ready to Guess! 🧠",
      subtitle: `${explainerName} is preparing to give you clues`,
      tips: [
        "Listen carefully to the clues",
        "Think outside the box",
        "You can make multiple guesses",
        "First correct guess gets the most points!",
      ],
    };
  };

  const { title, subtitle, tips } = getReadyMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
      <motion.div
        className="w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8">
          {/* Round Counter */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="inline-flex items-center bg-[#03624c]/20 border border-[#03624c]/30 rounded-full px-4 py-2 mb-4">
              <span className="text-[#03624c] font-semibold">
                Round {currentRound.number} of {totalRounds}
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-lg text-neutral-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {subtitle}
          </motion.p>

          {/* Loading Animation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {isExplainer ? (
              <motion.div className="flex justify-center items-center">
                <motion.div
                  className="w-8 h-8 border-4 border-[#03624c] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="ml-3 text-white">Selecting your word...</span>
              </motion.div>
            ) : (
              <motion.div className="flex justify-center items-center">
                <motion.div
                  className="flex space-x-1"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="w-3 h-3 bg-[#03624c] rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
                <span className="ml-3 text-white">
                  Waiting for {explainerName}...
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Tips Section */}
          <motion.div
            className="bg-neutral-800/50 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
              <span className="text-xl mr-2">💡</span>
              {isExplainer ? "Explainer Tips" : "Guesser Tips"}
            </h3>

            <div className="space-y-3">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="flex items-start text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <span className="text-[#03624c] mr-3 mt-0.5">•</span>
                  <span className="text-neutral-300 text-sm">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex justify-center items-center space-x-2">
              <div className="w-24 bg-neutral-700 rounded-full h-2">
                <motion.div
                  className="bg-[#03624c] h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(currentRound.number / totalRounds) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 1.5 }}
                />
              </div>
              <span className="text-xs text-neutral-400">
                {Math.round((currentRound.number / totalRounds) * 100)}%
                Complete
              </span>
            </div>
          </motion.div>

          {/* Fun Fact or Encouragement */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="text-xs text-neutral-500 italic">
              {isExplainer
                ? "Remember: creativity is key to helping your team win!"
                : "Stay alert and think fast - points decrease with each guess!"}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
