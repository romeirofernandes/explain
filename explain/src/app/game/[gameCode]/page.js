"use client";
import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GameLobby } from "@/components/game/GameLobby";
import { GamePlay } from "@/components/game/GamePlay";
import { GameResults } from "@/components/game/GameResults";

export default function GamePage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Unwrap the params Promise using React.use()
  const { gameCode } = use(params);

  const playerName = searchParams.get("player");
  const isHost = searchParams.get("host") === "true";

  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!gameCode || !playerName) {
      router.push("/");
      return;
    }

    // Listen to game changes in real-time
    const gameRef = doc(db, "games", gameCode);
    const unsubscribe = onSnapshot(
      gameRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setGameData(data);
          setLoading(false);
        } else {
          setError("Game not found");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to game:", error);
        setError("Failed to connect to game");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [gameCode, playerName, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-8 h-8 border-4 border-[#03624c] border-t-transparent rounded-full mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white text-lg">Connecting to game...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-[#03624c] text-white rounded-lg hover:bg-[#06302b] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Render different components based on game status
  const renderGameContent = () => {
    switch (gameData?.status) {
      case "lobby":
        return (
          <GameLobby
            gameData={gameData}
            playerName={playerName}
            isHost={isHost}
            gameCode={gameCode}
          />
        );
      case "playing":
        return (
          <GamePlay
            gameData={gameData}
            playerName={playerName}
            gameCode={gameCode}
          />
        );
      case "finished":
        return (
          <GameResults
            gameData={gameData}
            playerName={playerName}
            isHost={isHost}
            gameCode={gameCode}
          />
        );
      default:
        return <div className="text-white">Unknown game status</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">{renderGameContent()}</div>
  );
}
