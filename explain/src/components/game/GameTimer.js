"use client";
import { motion } from "framer-motion";

export const GameTimer = ({
  currentRound,
  totalRounds,
  timeLeft,
  isExplainer,
  explainerName,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <motion.div
        className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">
              Round {currentRound.number} of {totalRounds}
            </h1>
            <p className="text-neutral-400">
              {isExplainer
                ? "You are explaining"
                : `${explainerName} is explaining`}
            </p>
          </div>
          <div className="text-right">
            <motion.div
              className={`text-4xl font-bold ${
                timeLeft <= 10 ? "text-red-400" : "text-[#03624c]"
              }`}
              animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
              transition={{
                duration: 0.5,
                repeat: timeLeft <= 10 ? Infinity : 0,
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            <p className="text-xs text-neutral-500">Time left</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
