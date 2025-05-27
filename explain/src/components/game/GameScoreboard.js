"use client";

export const GameScoreboard = ({
  players,
  currentPlayerName,
  currentExplainerId,
}) => {
  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Current Scores</h3>

      <div className="space-y-2">
        {players
          .sort((a, b) => b.score - a.score)
          .map((player, index) => (
            <div
              key={player.id}
              className={`flex justify-between items-center p-2 rounded-lg ${
                player.name === currentPlayerName
                  ? "bg-[#03624c]/20 border border-[#03624c]/30"
                  : "bg-neutral-800/30"
              }`}
            >
              <div className="flex items-center">
                <span className="text-xs text-neutral-500 mr-2">
                  #{index + 1}
                </span>
                <span className="text-white font-medium">{player.name}</span>
                {player.id === currentExplainerId && (
                  <span className="ml-2 text-xs bg-[#03624c] text-white px-1 py-0.5 rounded">
                    EXPLAINING
                  </span>
                )}
              </div>
              <span className="text-white font-bold">{player.score}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
