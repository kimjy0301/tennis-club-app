"use client";

import { useState, useEffect } from "react";

interface Player {
  id: number;

  name: string;
}

export default function NewGame() {

  const [players, setPlayers] = useState<Player[]>([]);

  const [teamA, setTeamA] = useState<number[]>([]);

  const [teamB, setTeamB] = useState<number[]>([]);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [scoreA, setScoreA] = useState<number | "">("");

  const [scoreB, setScoreB] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");

      const data = await response.json();

      setPlayers(data);
    } catch {
      setError("선수 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    const playerGames = [
      ...teamA.map((id) => ({ playerId: id, team: "A" })),

      ...teamB.map((id) => ({ playerId: id, team: "B" })),
    ];

    try {
      const response = await fetch("/api/games", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          date,

          scoreTeamA: scoreA,

          scoreTeamB: scoreB,

          playerGames,
        }),
      });

      if (!response.ok) throw new Error("Failed to create game");

      setScoreA("");
      setScoreB("");
      setTeamA([]);
      setTeamB([]);

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch {
      setError("경기 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getAvailablePlayers = (team: "A" | "B", currentIndex: number) => {
    const selectedPlayers = team === "A" ? teamA : teamB;

    const otherTeamPlayers = team === "A" ? teamB : teamA;

    return players.filter(
      (player) =>
        !otherTeamPlayers.includes(player.id) &&
        (!selectedPlayers.includes(player.id) ||
          selectedPlayers[currentIndex] === player.id)
    );
  };

  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          경기가 성공적으로 등록되었습니다!
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">경기 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 날짜 선택 */}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">
              경기 날짜
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="tennis-input w-full text-lg py-3"
            />
          </div>
        </div>

        {/* 점수 입력 */}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">점수</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                A팀
              </label>

              <div className="flex items-center justify-center sm:justify-start">
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={scoreA}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : parseInt(e.target.value);

                    if (value === "" || (value >= 0 && value <= 6)) {
                      setScoreA(value);
                    }
                  }}
                  className="tennis-input w-44 text-center text-2xl py-2 mx-2"
                />
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setScoreA((prev) => {
                        if (prev === "" || prev === undefined) return 1;

                        return prev < 6 ? prev + 1 : prev;
                      })
                    }
                    className="tennis-button h-8 w-8 sm:h-6 sm:w-6 flex items-center justify-center text-sm rounded-t"
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setScoreA((prev) =>
                        typeof prev === "number" && prev > 0 ? prev - 1 : prev
                      )
                    }
                    className="tennis-button h-8 w-8 sm:h-6 sm:w-6 flex items-center justify-center text-sm rounded-b"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 py-2">VS</div>

            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                B팀
              </label>

              <div className="flex items-center justify-center sm:justify-start">
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={scoreB}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : parseInt(e.target.value);

                    if (value === "" || (value >= 0 && value <= 6)) {
                      setScoreB(value);
                    }
                  }}
                  className="tennis-input w-44 text-center text-2xl py-2 mr-2"
                />

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setScoreB((prev) => {
                        if (prev === "" || prev === undefined) return 1;

                        return prev < 6 ? prev + 1 : prev;
                      })
                    }
                    className="tennis-button h-8 w-8 sm:h-6 sm:w-6 flex items-center justify-center text-sm rounded-t"
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setScoreB((prev) =>
                        typeof prev === "number" && prev > 0 ? prev - 1 : prev
                      )
                    }
                    className="tennis-button h-8 w-8 sm:h-6 sm:w-6 flex items-center justify-center text-sm rounded-b"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 선수 선택 */}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            선수 선택
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* A팀 선수 선택 */}

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">A팀</h3>

              <div className="space-y-3">
                {[0, 1].map((index) => (
                  <select
                    key={`A-${index}`}
                    value={teamA[index] || ""}
                    onChange={(e) => {
                      const newValue = e.target.value
                        ? parseInt(e.target.value)
                        : undefined;

                      const newTeamA = [...teamA];

                      if (newValue) {
                        newTeamA[index] = newValue;
                      } else {
                        newTeamA.splice(index, 1);
                      }

                      setTeamA(newTeamA.filter(Boolean));
                    }}
                    className="tennis-input w-full py-3 bg-white"
                  >
                    <option value="">선수 선택</option>

                    {getAvailablePlayers("A", index).map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            {/* B팀 선수 선택 */}

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">B팀</h3>

              <div className="space-y-3">
                {[0, 1].map((index) => (
                  <select
                    key={`B-${index}`}
                    value={teamB[index] || ""}
                    onChange={(e) => {
                      const newValue = e.target.value
                        ? parseInt(e.target.value)
                        : undefined;

                      const newTeamB = [...teamB];

                      if (newValue) {
                        newTeamB[index] = newValue;
                      } else {
                        newTeamB.splice(index, 1);
                      }

                      setTeamB(newTeamB.filter(Boolean));
                    }}
                    className="tennis-input w-full py-3"
                  >
                    <option value="">선수 선택</option>

                    {getAvailablePlayers("B", index).map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="tennis-button w-full py-4 text-lg relative"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              등록 중...
            </span>
          ) : (
            "경기 등록"
          )}
        </button>
      </form>
    </div>
  );
}
