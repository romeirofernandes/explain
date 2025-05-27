export function calculateGuessPoints(guessOrder, timeRemaining, totalTime) {
  const basePoints = Math.max(100 - guessOrder * 20, 10);
  const timeBonus = Math.floor((timeRemaining / totalTime) * 50);

  return basePoints + timeBonus;
}

export function calculateExplainerPoints(correctGuesses, totalPlayers) {
  if (correctGuesses === 0) return 0;
  const basePoints = 30;
  const bonusPoints = (correctGuesses - 1) * 15;

  const perfectBonus = correctGuesses === totalPlayers ? 25 : 0;

  return basePoints + bonusPoints + perfectBonus;
}

export function generateRoomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function getRandomLettersForHint(word, alreadyRevealed = [], count = 1) {
  const availableLetters = [...new Set(word.toLowerCase().split(""))].filter(
    (letter) =>
      !alreadyRevealed.includes(letter) &&
      letter !== " " &&
      letter.match(/[a-z]/)
  );

  const shuffled = availableLetters.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function isCorrectGuess(guess, targetWord) {
  return guess.trim().toLowerCase() === targetWord.toLowerCase();
}

export function getNextExplainer(players, roundNumber) {
  const connectedPlayers = players.filter((p) => p.isConnected);
  if (connectedPlayers.length === 0) return null;

  const explainerIndex = (roundNumber - 1) % connectedPlayers.length;
  return connectedPlayers[explainerIndex].id;
}

export function isValidExplanation(explanation, targetWord) {
  const cleanExplanation = explanation.toLowerCase().replace(/[^a-z]/g, "");
  const cleanTargetWord = targetWord.toLowerCase().replace(/[^a-z]/g, "");

  if (cleanExplanation.includes(cleanTargetWord)) {
    return false;
  }

  const spacelessExplanation = explanation
    .toLowerCase()
    .replace(/[\s\-_.,!?;:]/g, "");
  const spacelessTargetWord = targetWord
    .toLowerCase()
    .replace(/[\s\-_.,!?;:]/g, "");

  if (spacelessExplanation.includes(spacelessTargetWord)) {
    return false;
  }
  const letterPattern = cleanTargetWord.split("").join("[^a-z]*");
  const regex = new RegExp(letterPattern, "i");

  if (regex.test(explanation)) {
    return false;
  }

  return true;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getGameStatusText(status, roundNumber, totalRounds) {
  switch (status) {
    case "lobby":
      return "Waiting for players...";
    case "playing":
      return `Round ${roundNumber} of ${totalRounds}`;
    case "finished":
      return "Game finished!";
    default:
      return "Unknown status";
  }
}

export function canStartGame(players, minPlayers = 2) {
  const connectedPlayers = players.filter((p) => p.isConnected);
  return connectedPlayers.length >= minPlayers;
}

export function getLeaderboard(players) {
  return [...players]
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
}
