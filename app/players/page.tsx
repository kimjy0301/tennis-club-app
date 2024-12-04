"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GameHistoryModal from "@/components/GameHistoryModal";
import { Achievement } from "@/types/game";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PlayerStats {
  id: number;
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
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

type SortOption = "winRate" | "totalGames";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function PlayerStats() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("winRate");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [dateRange, setDateRange] = useState<"month" | "all">("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [playerAchievements, setPlayerAchievements] = useState<Achievement[]>(
    []
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = `${API_URL}/api/players/stats`;
        const params = new URLSearchParams();

        if (dateRange === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          params.append("startDate", monthAgo.toISOString());
          params.append("endDate", new Date().toISOString());
        } else if (dateRange === "all" && startDate && endDate) {
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          params.append("startDate", new Date(startDate).toISOString());
          params.append("endDate", endDateTime.toISOString());
        }

        const queryString = params.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;

        const response = await fetch(finalUrl);
        const data = await response.json();

        setPlayers(data);
      } catch (error) {
        console.error("Error fetching player stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange, startDate, endDate]);

  const fetchPlayerGames = async (playerId: number) => {
    setLoadingGames(true);
    try {
      const url = `${API_URL}/api/players/${playerId}/games`;

      const achievementsUrl = `${API_URL}/api/players/achievements/${playerId}`;
      const params = new URLSearchParams();

      if (dateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        params.append("startDate", monthAgo.toISOString());
        params.append("endDate", new Date().toISOString());
      } else if (dateRange === "all" && startDate && endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.append("startDate", new Date(startDate).toISOString());
        params.append("endDate", endDateTime.toISOString());
      }

      const queryString = params.toString();
      const finalUrl = queryString ? `${url}?${queryString}` : url;

      const finalAchievementsUrl = queryString
        ? `${achievementsUrl}?${queryString}`
        : achievementsUrl;

      // 게임 데이터와 업적 데이터를 병렬로 가져오기
      const [gamesResponse, achievementsResponse] = await Promise.all([
        fetch(finalUrl),
        fetch(finalAchievementsUrl),
      ]);

      const [gamesData, achievementsData] = await Promise.all([
        gamesResponse.json(),
        achievementsResponse.json(),
      ]);

      setPlayerGames(gamesData);
      setPlayerAchievements(achievementsData);
    } catch (error) {
      console.error("Error fetching player games:", error);
      setPlayerGames([]);
    } finally {
      setLoadingGames(false);
    }
  };

  const handlePlayerClick = async (playerId: number) => {
    setSelectedPlayerId(playerId);
    await fetchPlayerGames(playerId);
  };

  const getSortedPlayers = () => {
    return [...players].sort((a, b) => {
      if (sortBy === "winRate") {
        return b.winRate - a.winRate;
      }
      return b.totalGames - a.totalGames;
    });
  };

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId)?.name;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">선수별 전적</h1>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-2 border rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="winRate">승률순</option>
          <option value="totalGames">경기수순</option>
        </select>
      </div>
      {/* 날짜 필터 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setDateRange("month")}
              className={`px-4 py-2 rounded-md flex-1 sm:flex-none ${
                dateRange === "month"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              최근 1개월
            </button>
            <button
              onClick={() => setDateRange("all")}
              className={`px-4 py-2 rounded-md flex-1 sm:flex-none ${
                dateRange === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체 기간
            </button>
          </div>

          {dateRange === "all" && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="tennis-input w-full sm:w-auto"
              />
              <span className="hidden sm:block">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="tennis-input w-full sm:w-auto"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {getSortedPlayers().map((player) => (
          <div
            key={player.id}
            className="sport-card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handlePlayerClick(player.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={player.profileImage || "/default-profile.png"}
                    alt={player.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {player.name}
                </h2>
              </div>
              <span className="tennis-ball text-2xl">🎾</span>
            </div>

            <div className="relative h-4 bg-gray-200 rounded-full mb-4">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                style={{ width: `${player.winRate}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">승률</div>
                <div className="text-lg font-bold text-gray-900">
                  {player.winRate.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">승</div>
                <div className="text-lg font-bold text-green-600">
                  {player.wins}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">패</div>
                <div className="text-lg font-bold text-red-600">
                  {player.losses}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-sm text-gray-500">
                총 {player.totalGames}경기 참여
              </div>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          등록된 경기 기록이 없습니다.
        </div>
      )}

      <GameHistoryModal
        isOpen={selectedPlayerId !== null}
        onClose={() => setSelectedPlayerId(null)}
        playerName={selectedPlayer || ""}
        games={playerGames}
        loading={loadingGames}
        achievements={playerAchievements}
      />
    </div>
  );
}
