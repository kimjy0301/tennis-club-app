// Client Component
"use client";

import { useEffect, useState } from "react";

interface Player {
  id: number;
  name: string;
  profileImage?: string;
}

interface Tournament {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  matches: {
    id: number;
    round: number;
    matchOrder: number;
    score1?: number;
    score2?: number;
    playedAt?: string;
    player1?: Player;
    player2?: Player;
    winner?: Player;
  }[];
  players: {
    player: Player;
  }[];
}

export default function TournamentDetail({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  useEffect(() => {
    async function fetchTournament() {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`);
        if (!response.ok) throw new Error("Failed to fetch tournament");
        const data = await response.json();
        setTournament(data);
      } catch {
        setError("대회정보 호출 실패");
      }
    }

    async function fetchPlayers() {
      try {
        const response = await fetch("/api/players");
        if (!response.ok) throw new Error("Failed to fetch players");
        const data = await response.json();
        setPlayers(data);
      } catch {
        setError("선수 정보 호출 실패");
      }
    }

    fetchTournament();
    fetchPlayers();
  }, [tournamentId]);

  const handleAddPlayers = async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerIds: selectedPlayers }),
      });

      if (!response.ok) throw new Error("Failed to add players");

      // 토너먼트 정보 새로고침
      const tournamentResponse = await fetch(
        `/api/tournaments/${tournamentId}`
      );
      const updatedTournament = await tournamentResponse.json();

      setTournament(updatedTournament);
      setSelectedPlayers([]); // 선택 초기화
      setShowPlayerModal(false);
    } catch {
      setError("선수 추가 실패");
    }
  };

  const handleRemovePlayer = async (playerId: number) => {
    try {
      const response = await fetch(
        `/api/tournaments/${tournamentId}/players/${playerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove player");

      // 토너먼트 정보 새로고침
      const tournamentResponse = await fetch(
        `/api/tournaments/${tournamentId}`
      );
      const updatedTournament = await tournamentResponse.json();

      setTournament(updatedTournament);
    } catch {
      setError("선수 삭제 실패");
    }
  };

  if (error) return <div>{error}</div>;
  if (!tournament) return <div>대회를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{tournament.name}</h1>
        <div className="mb-4 text-gray-600">
          <p>시작일: {new Date(tournament.startDate).toLocaleDateString()}</p>
          <p>종료일: {new Date(tournament.endDate).toLocaleDateString()}</p>
          <p>상태: {tournament.status}</p>
        </div>

        {/* 참가 선수 관리 섹션 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">참가 선수</h2>
            <button
              onClick={() => setShowPlayerModal(true)}
              className="tennis-button text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
            >
              선수 추가
            </button>
          </div>

          {/* 현재 참가 선수 목록 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tournament.players.map((player) => (
              <div
                key={player.player.id}
                className="border rounded-lg p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {player.player.profileImage && (
                    <img
                      src={player.player.profileImage}
                      alt={player.player.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span>{player.player.name}</span>
                </div>
                <button
                  onClick={() => handleRemovePlayer(player.player.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 선수 추가 모달 */}
        {showPlayerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">선수 추가</h3>
                <button
                  onClick={() => {
                    setShowPlayerModal(false);
                    setSelectedPlayers([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {players
                  .filter(
                    (player) =>
                      !tournament.players.some(
                        (tournamentPlayer) =>
                          tournamentPlayer.player.id === player.id
                      )
                  )
                  .map((player) => (
                    <div
                      key={player.id}
                      className="border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPlayers.includes(player.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlayers([
                                ...selectedPlayers,
                                player.id,
                              ]);
                            } else {
                              setSelectedPlayers(
                                selectedPlayers.filter((id) => id !== player.id)
                              );
                            }
                          }}
                          className="form-checkbox"
                        />
                        {player.name}
                      </label>
                    </div>
                  ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddPlayers}
                  disabled={selectedPlayers.length === 0}
                  className="tennis-button text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  선택 완료 ({selectedPlayers.length}명)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
