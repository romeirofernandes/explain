"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  isCorrectGuess,
  isValidExplanation,
  getRandomLettersForHint,
} from "@/utils/gameLogic";
import { getRandomWordByDifficulty } from "@/constants/words";
import { GameTimer } from "./GameTimer";
import { ExplainerSection } from "./ExplainerSection";
import { GuesserSection } from "./GuesserSection";
import { LiveActivity } from "./LiveActivity";
import { GameScoreboard } from "./GameScoreboard";
import { RoundResults } from "./RoundResults";
import { WaitingScreen } from "./WaitingScreen";

export const GamePlay = ({ gameData, playerName, gameCode }) => {
  const [timeLeft, setTimeLeft] = useState(gameData.settings.roundTime);
  const [currentWord, setCurrentWord] = useState("");
  const [roundStarted, setRoundStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [roundResults, setRoundResults] = useState(null);
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [wordDisplay, setWordDisplay] = useState("");

  const currentPlayer = gameData.players.find((p) => p.name === playerName);
  const explainer = gameData.players.find(
    (p) => p.id === gameData.currentRound.explainerId
  );
  const isExplainer = currentPlayer?.id === gameData.currentRound.explainerId;

  const playerGuess = gameData.currentRound.guesses?.find(
    (g) => g.playerId === currentPlayer?.id && g.isCorrect
  );
  const hasGuessedCorrectly = !!playerGuess;

  // Check if all non-explainer players have guessed correctly
  const nonExplainerPlayers = gameData.players.filter(
    (p) => p.id !== gameData.currentRound.explainerId
  );
  const correctGuesses =
    gameData.currentRound.guesses?.filter((g) => g.isCorrect) || [];
  const allPlayersGuessed =
    nonExplainerPlayers.length > 0 &&
    correctGuesses.length >= nonExplainerPlayers.length;

  const endRound = useCallback(async () => {
    if (showResults) return;

    setShowResults(true);
    setRoundStarted(false);

    try {
      const correctGuesses =
        gameData.currentRound.guesses?.filter((g) => g.isCorrect) || [];
      const explainerPoints = correctGuesses.length * 30;

      const updatedPlayers = gameData.players.map((player) => {
        if (player.id === gameData.currentRound.explainerId) {
          return { ...player, score: player.score + explainerPoints };
        }

        const playerCorrectGuess = correctGuesses.find(
          (g) => g.playerId === player.id
        );
        if (playerCorrectGuess) {
          const guessPoints = Math.max(
            100 - (playerCorrectGuess.order - 1) * 20,
            10
          );
          return { ...player, score: player.score + guessPoints };
        }

        return player;
      });

      const results = {
        word: currentWord,
        explainer: explainer.name,
        correctGuesses: correctGuesses.length,
        totalPlayers: nonExplainerPlayers.length,
        explainerPoints,
        playerResults: updatedPlayers.map((p) => ({
          name: p.name,
          scoreGained:
            p.score - gameData.players.find((gp) => gp.id === p.id).score,
          totalScore: p.score,
          wasExplainer: p.id === gameData.currentRound.explainerId,
          guessedCorrectly: correctGuesses.some((g) => g.playerId === p.id),
        })),
      };

      setRoundResults(results);

      // Calculate current turn and round
      const currentTurn = gameData.currentRound.number;
      const totalPlayers = gameData.players.length;
      const totalTurns = gameData.settings.totalRounds * totalPlayers;

      const isGameFinished = currentTurn >= totalTurns;

      if (isGameFinished) {
        const gameRef = doc(db, "games", gameCode);
        await updateDoc(gameRef, {
          players: updatedPlayers,
          status: "finished",
          "currentRound.status": "finished",
          lastActivity: new Date().toISOString(),
        });
      } else {
        setTimeout(async () => {
          const nextExplainerId = getNextExplainer(
            updatedPlayers,
            currentTurn + 1
          );

          const gameRef = doc(db, "games", gameCode);
          await updateDoc(gameRef, {
            players: updatedPlayers,
            "currentRound.number": currentTurn + 1,
            "currentRound.explainerId": nextExplainerId,
            "currentRound.word": null,
            "currentRound.clue": "",
            "currentRound.status": "waiting",
            "currentRound.guesses": [],
            "currentRound.startTime": null,
            "currentRound.endTime": null,
            lastActivity: new Date().toISOString(),
          });
          setShowResults(false);
          setRoundResults(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error ending round:", error);
    }
  }, [
    showResults,
    gameData,
    currentWord,
    explainer,
    gameCode,
    nonExplainerPlayers.length,
  ]);

  const startRound = useCallback(async () => {
    const word = getRandomWordByDifficulty(gameData.settings.difficulty);
    setCurrentWord(word);
    setRoundStarted(true);

    try {
      const gameRef = doc(db, "games", gameCode);
      await updateDoc(gameRef, {
        "currentRound.word": word,
        "currentRound.status": "active",
        "currentRound.clue": "",
        "currentRound.startTime": new Date().toISOString(),
        "currentRound.endTime": new Date(
          Date.now() + gameData.settings.roundTime * 1000
        ).toISOString(),
        lastActivity: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error starting round:", error);
    }
  }, [gameData.settings.roundTime, gameData.settings.difficulty, gameCode]);

  // Sync timer with actual round time
  useEffect(() => {
    if (
      gameData.currentRound.status === "active" &&
      gameData.currentRound.startTime
    ) {
      const startTime = new Date(gameData.currentRound.startTime).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(gameData.settings.roundTime - elapsed, 0);

      setTimeLeft(remaining);
      setRoundStarted(true);
      setCurrentWord(gameData.currentRound.word || "");

      if (remaining <= 0) {
        endRound();
      }
    }
  }, [gameData.currentRound, gameData.settings.roundTime, endRound]);

  useEffect(() => {
    if (gameData.currentRound.status === "waiting" && isExplainer) {
      startRound();
    }
  }, [gameData.currentRound.status, isExplainer, startRound]);

  // Timer countdown
  useEffect(() => {
    if (!roundStarted || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [roundStarted, timeLeft, showResults, endRound]);

  // Auto-end round when all players have guessed correctly
  useEffect(() => {
    if (allPlayersGuessed && roundStarted && !showResults) {
      endRound();
    }
  }, [allPlayersGuessed, roundStarted, showResults, endRound]);

  // Reveal letters at intervals
  useEffect(() => {
    if (!currentWord || !roundStarted) {
      setRevealedLetters([]);
      setWordDisplay("");
      return;
    }

    const initialDisplay = currentWord
      .split("")
      .map(() => "_")
      .join(" ");
    setWordDisplay(initialDisplay);
    setRevealedLetters([]);

    const revealIntervals = [20, 40, 60]; // seconds
    const timers = [];

    revealIntervals.forEach((seconds, index) => {
      if (index < 3) {
        const timer = setTimeout(() => {
          if (timeLeft > 0 && !showResults) {
            setRevealedLetters((prev) => {
              const newLetters = getRandomLettersForHint(currentWord, prev, 1);
              if (newLetters.length > 0) {
                const updated = [...prev, ...newLetters];

                const newDisplay = currentWord
                  .split("")
                  .map((letter, idx) => {
                    if (updated.includes(letter.toLowerCase())) {
                      return letter.toUpperCase();
                    }
                    return "_";
                  })
                  .join(" ");

                setWordDisplay(newDisplay);
                return updated;
              }
              return prev;
            });
          }
        }, seconds * 1000);

        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [currentWord, roundStarted, timeLeft, showResults]);

  const updateClue = async (newClue) => {
    if (!isExplainer) return;

    if (newClue.trim() && !isValidExplanation(newClue, currentWord)) {
      return {
        success: false,
        error:
          "Your clue contains the word or its letters! Try a different approach.",
      };
    }

    try {
      const gameRef = doc(db, "games", gameCode);
      await updateDoc(gameRef, {
        "currentRound.clue": newClue.trim(),
        lastActivity: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating clue:", error);
      return { success: false, error: "Failed to update clue" };
    }
  };

  const submitGuess = async (guess) => {
    if (!guess.trim() || !roundStarted || isExplainer || hasGuessedCorrectly)
      return;

    const isCorrect = isCorrectGuess(guess, currentWord);
    const existingCorrectGuesses = (gameData.currentRound.guesses || []).filter(
      (g) => g.isCorrect
    );

    const guessData = {
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      guess: guess.trim(),
      isCorrect,
      timestamp: new Date().toISOString(),
      order: isCorrect ? existingCorrectGuesses.length + 1 : 0,
      timeRemaining: timeLeft,
    };

    try {
      const gameRef = doc(db, "games", gameCode);
      const updatedGuesses = [
        ...(gameData.currentRound.guesses || []),
        guessData,
      ];

      await updateDoc(gameRef, {
        "currentRound.guesses": updatedGuesses,
        lastActivity: new Date().toISOString(),
      });

      return { success: true, isCorrect };
    } catch (error) {
      console.error("Error submitting guess:", error);
      return { success: false, error: "Failed to submit guess" };
    }
  };

  const getNextExplainer = (players, turnNumber) => {
    const availablePlayers = players.filter((p) => p.isConnected !== false);
    const explainerIndex = (turnNumber - 1) % availablePlayers.length;
    return availablePlayers[explainerIndex]?.id;
  };

  // Calculate current round and turn for display
  const currentTurn = gameData.currentRound.number;
  const totalPlayers = gameData.players.length;
  const currentRoundNumber = Math.ceil(currentTurn / totalPlayers);
  const totalTurns = gameData.settings.totalRounds * totalPlayers;

  if (showResults && roundResults) {
    return (
      <RoundResults
        roundResults={roundResults}
        currentRound={{
          ...gameData.currentRound,
          displayRound: currentRoundNumber,
          turnInRound: ((currentTurn - 1) % totalPlayers) + 1,
        }}
        totalRounds={gameData.settings.totalRounds}
        playerName={playerName}
        isGameFinished={currentTurn >= totalTurns}
      />
    );
  }

  if (!roundStarted && gameData.currentRound.status === "waiting") {
    return (
      <WaitingScreen
        currentRound={{
          ...gameData.currentRound,
          displayRound: currentRoundNumber,
          turnInRound: ((currentTurn - 1) % totalPlayers) + 1,
        }}
        totalRounds={gameData.settings.totalRounds}
        isExplainer={isExplainer}
        explainerName={explainer?.name}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-neutral-950">
      <GameTimer
        currentRound={{
          ...gameData.currentRound,
          displayRound: currentRoundNumber,
          turnInRound: ((currentTurn - 1) % totalPlayers) + 1,
        }}
        totalRounds={gameData.settings.totalRounds}
        timeLeft={timeLeft}
        isExplainer={isExplainer}
        explainerName={explainer?.name}
      />

      <div className="flex-1 w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isExplainer ? (
            <ExplainerSection
              currentWord={currentWord}
              currentClue={gameData.currentRound.clue || ""}
              onUpdateClue={updateClue}
              roundStarted={roundStarted}
            />
          ) : (
            <GuesserSection
              explainerName={explainer?.name}
              currentClue={gameData.currentRound.clue || ""}
              hasGuessedCorrectly={hasGuessedCorrectly}
              onSubmitGuess={submitGuess}
              roundStarted={roundStarted}
              wordDisplay={wordDisplay}
              wordLength={currentWord.length}
            />
          )}
        </div>

        <div className="space-y-6">
          <LiveActivity
            guesses={gameData.currentRound.guesses || []}
            hideGuessWords={true}
          />
          <GameScoreboard
            players={gameData.players}
            currentPlayerName={playerName}
            currentExplainerId={gameData.currentRound.explainerId}
          />
        </div>
      </div>
    </div>
  );
};
