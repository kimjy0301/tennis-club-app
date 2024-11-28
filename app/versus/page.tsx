"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Player {
  id: number;
  name: string;
  profileImage?: string;
}

interface Game {
  id: number;
  date: string;
  scoreTeamA: number;
  scoreTeamB: number;
  playerGames: {
    player: {
      id: number;
      name: string;
      profileImage?: string;
    };
    team: string;
  }[];
}

interface VersusStats {
  totalGames: number;
  player1Wins: number;
  player2Wins: number;
  winRate: number;
}

export default function VersusPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [player1Id, setPlayer1Id] = useState<number | null>(null);
  const [player2Id, setPlayer2Id] = useState<number | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [stats, setStats] = useState<VersusStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (player1Id && player2Id) {
      fetchVersusGames();
    }
  }, [player1Id, player2Id]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/players");
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersusGames = async () => {
    if (!player1Id || !player2Id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/versus?player1=${player1Id}&player2=${player2Id}`
      );
      const data = await response.json();
      setGames(data.games);

      // 통계 계산
      const stats = calculateStats(data.games, player1Id, player2Id);
      setStats(stats);
    } catch (error) {
      console.error("Error fetching versus games:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (
    games: Game[],
    p1Id: number,
    p2Id: number
  ): VersusStats => {
    let player1Wins = 0;
    let player2Wins = 0;

    games.forEach((game) => {
      const player1Team = game.playerGames.find(
        (pg) => pg.player.id === p1Id
      )?.team;
      const player2Team = game.playerGames.find(
        (pg) => pg.player.id === p2Id
      )?.team;

      if (player1Team && player2Team) {
        const isTeamAWin = game.scoreTeamA > game.scoreTeamB;
        if (
          (player1Team === "A" && isTeamAWin) ||
          (player1Team === "B" && !isTeamAWin)
        ) {
          player1Wins++;
        } else {
          player2Wins++;
        }
      }
    });

    const totalGames = games.length;
    const winRate = totalGames > 0 ? (player1Wins / totalGames) * 100 : 0;

    return {
      totalGames,
      player1Wins,
      player2Wins,
      winRate,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">상대 전적</h1>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* 선수 1 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            선수 1
          </label>
          <select
            value={player1Id || ""}
            onChange={(e) => setPlayer1Id(Number(e.target.value))}
            className="tennis-input w-full"
          >
            <option value="">선수 선택</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* 선수 2 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            선수 2
          </label>
          <select
            value={player2Id || ""}
            onChange={(e) => setPlayer2Id(Number(e.target.value))}
            className="tennis-input w-full"
          >
            <option value="">선수 선택</option>
            {players
              .filter((player) => player.id !== player1Id)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {stats && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Player 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
              <Image
                src={
                  players.find((p) => p.id === player1Id)?.profileImage ||
                  "/default-profile.png"
                }
                alt={players.find((p) => p.id === player1Id)?.name || ""}
                width={80}
                height={80}
                className="rounded-full w-16 h-16 sm:w-20 sm:h-20 object-cover mb-2 sm:mb-0"
              />
              <div>
                <div className="text-lg sm:text-xl font-bold mb-1">
                  {players.find((p) => p.id === player1Id)?.name}
                </div>
                <div className="text-base sm:text-lg font-bold text-green-600">
                  {stats.player1Wins}승
                  <span className="text-xs sm:text-sm ml-1 text-gray-500">
                    (
                    {stats.totalGames > 0
                      ? ((stats.player1Wins / stats.totalGames) * 100).toFixed(
                          1
                        )
                      : "0.0"}
                    %)
                  </span>
                </div>
              </div>
            </div>

            {/* Total Games */}
            <div className="self-center border-t border-b sm:border-0 py-3 sm:py-0 my-3 sm:my-0">
              <div className="text-base sm:text-lg font-bold">
                {stats.totalGames}경기
              </div>
              <div className="text-xs sm:text-sm text-gray-500">총 경기</div>
            </div>

            {/* Player 2 */}
            <div className="flex flex-col-reverse sm:flex-row items-center sm:space-x-4">
              <div>
                <div className="text-lg sm:text-xl font-bold mb-1">
                  {players.find((p) => p.id === player2Id)?.name}
                </div>
                <div className="text-base sm:text-lg font-bold text-red-600">
                  {stats.player2Wins}승
                  <span className="text-xs sm:text-sm ml-1 text-gray-500">
                    (
                    {stats.totalGames > 0
                      ? ((stats.player2Wins / stats.totalGames) * 100).toFixed(
                          1
                        )
                      : "0.0"}
                    %)
                  </span>
                </div>
              </div>
              <Image
                src={
                  players.find((p) => p.id === player2Id)?.profileImage ||
                  "/default-profile.png"
                }
                alt={players.find((p) => p.id === player2Id)?.name || ""}
                width={80}
                height={80}
                className="rounded-full w-16 h-16 sm:w-20 sm:h-20 object-cover mb-2 sm:mb-0"
              />
            </div>
          </div>
        </div>
      )}

      {games.length > 0 && (
        <div className="space-y-4">
          {games.map((game) => {
            // 승패 계산
            const player1Team = game.playerGames.find(
              (pg) => pg.player.id === player1Id
            )?.team;
            const isTeamAWin = game.scoreTeamA > game.scoreTeamB;
            const isPlayer1Win =
              (player1Team === "A" && isTeamAWin) ||
              (player1Team === "B" && !isTeamAWin);

            return (
              <div key={game.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-500 mb-4 font-semibold">
                  {formatDate(game.date)}
                </div>
                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  {/* Team A */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      A팀
                    </div>
                    <div className="font-bold text-2xl mb-2">
                      {game.playerGames.find((pg) => pg.player.id === player1Id)
                        ?.team === "A"
                        ? game.scoreTeamA
                        : game.scoreTeamB}
                    </div>
                    <div className="text-sm text-gray-600">
                      {game.playerGames
                        .filter((pg) => pg.team === "A")
                        .map((pg) => (
                          <div
                            key={pg.player.id}
                            className={`${
                              [player1Id, player2Id].includes(pg.player.id)
                                ? "font-semibold text-green-600"
                                : ""
                            }`}
                          >
                            {pg.player.name}
                            {pg.player.id === player1Id && (
                              <span
                                className={`ml-1 ${isPlayer1Win ? "text-blue-600" : "text-red-600"}`}
                              >
                                {isPlayer1Win ? "(승)" : "(패)"}
                              </span>
                            )}
                            {pg.player.id === player2Id && (
                              <span
                                className={`ml-1 ${!isPlayer1Win ? "text-blue-600" : "text-red-600"}`}
                              >
                                {!isPlayer1Win ? "(승)" : "(패)"}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">VS</span>
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      B팀
                    </div>
                    <div className="font-bold text-2xl mb-2">
                      {game.playerGames.find((pg) => pg.player.id === player2Id)
                        ?.team === "A"
                        ? game.scoreTeamA
                        : game.scoreTeamB}
                    </div>
                    <div className="text-sm text-gray-600">
                      {game.playerGames
                        .filter((pg) => pg.team === "B")
                        .map((pg) => (
                          <div
                            key={pg.player.id}
                            className={`${
                              [player1Id, player2Id].includes(pg.player.id)
                                ? "font-semibold text-green-600"
                                : ""
                            }`}
                          >
                            {pg.player.name}
                            {pg.player.id === player1Id && (
                              <span
                                className={`ml-1 ${isPlayer1Win ? "text-blue-600" : "text-red-600"}`}
                              >
                                {isPlayer1Win ? "(승)" : "(패)"}
                              </span>
                            )}
                            {pg.player.id === player2Id && (
                              <span
                                className={`ml-1 ${!isPlayer1Win ? "text-blue-600" : "text-red-600"}`}
                              >
                                {!isPlayer1Win ? "(승)" : "(패)"}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
