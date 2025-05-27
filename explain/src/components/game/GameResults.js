"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const GameResults = ({ gameData, playerName, isHost, gameCode }) => {
  const router = useRouter();

  // Auto-delete game after 5 minutes
  useEffect(() => {
    const deleteTimer = setTimeout(async () => {
      if (isHost) {
        try {
          const gameRef = doc(db, "games", gameCode);
          await deleteDoc(gameRef);
          console.log("Game deleted from Firestore");
        } catch (error) {
          console.error("Error deleting game:", error);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(deleteTimer);
  }, [gameCode, isHost]);

  const sortedPlayers = [...gameData.players].sort((a, b) => b.score - a.score);

  const handleBackHome = async () => {
    // Immediate cleanup if host clicks back
    if (isHost) {
      try {
        const gameRef = doc(db, "games", gameCode);
        await deleteDoc(gameRef);
      } catch (error) {
        console.error("Error deleting game:", error);
      }
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Game Over!</h1>
          <p className="text-neutral-400 mb-8">Final Results</p>

          <div className="space-y-4 mb-8">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-4">
                    {index === 0
                      ? "🏆"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </span>
                  <span className="text-white font-medium">{player.name}</span>
                  {player.name === playerName && (
                    <span className="text-[#03624c] ml-2">(You)</span>
                  )}
                </div>
                <span className="text-white font-bold text-xl">
                  {player.score}
                </span>
              </motion.div>
            ))}
          </div>

          <button
            onClick={handleBackHome}
            className="w-full h-12 rounded-xl text-base font-medium text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #03624c 0%, #06302b 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};
