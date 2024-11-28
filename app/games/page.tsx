"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GameCard from "@/components/GameCard";
import Modal from "@/components/Modal";

interface Player {
  id: number;
  name: string;
  profileImage?: string;
}

interface PlayerGame {
  id: number;
  player: Player;
  playerId: number;
  gameId: number;
  team: string;
}

interface Game {
  id: number;
  date: string;
  scoreTeamA: number;
  scoreTeamB: number;
  playerGames: PlayerGame[];
}

interface GroupedGames {
  [key: string]: Game[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"month" | "all">("month");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const selectedDate = searchParams.get("date");
  const isModalOpen = Boolean(selectedDate);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games`);
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filterGamesByDate = (games: Game[]) => {
    let filteredGames = [...games];

    if (dateRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredGames = games.filter((game) => new Date(game.date) >= monthAgo);
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // 종료일 마지막 시간으로 설정
      filteredGames = games.filter((game) => {
        const gameDate = new Date(game.date);
        return gameDate >= start && gameDate <= end;
      });
    }

    return filteredGames;
  };

  const groupGamesByDate = (games: Game[]): GroupedGames => {
    return games.reduce((groups: GroupedGames, game) => {
      const date = new Date(game.date);
      const dateKey = date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(game);
      return groups;
    }, {});
  };

  const filteredGames = filterGamesByDate(games);
  const groupedGames = groupGamesByDate(filteredGames);
  const sortedDates = Object.keys(groupedGames).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleDateClick = (dateKey: string) => {
    // URL에 선택된 날짜 추가
    router.push(`/games?date=${encodeURIComponent(dateKey)}`, {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    // 모달 닫을 때 쿼리 파라미 제거
    router.push("/games", { scroll: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">경기 결과</h1>
        <Link href="/games/new" className="tennis-button">
          새 경기 등록
        </Link>
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
              <div className="w-full sm:w-auto">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  시작일
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="tennis-input w-full"
                />
              </div>
              <span className="hidden sm:block">~</span>
              <div className="w-full sm:w-auto">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  종료일
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="tennis-input w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 경기 결과 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedDates.map((dateKey) => (
          <button
            key={dateKey}
            onClick={() => handleDateClick(dateKey)}
            className="sport-card p-4 text-left hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {dateKey}
                </h3>
                <p className="text-sm text-gray-500">
                  {groupedGames[dateKey].length}경기 진행
                </p>
              </div>
              <span className="text-green-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 모달 유지 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedDate ? `${selectedDate} 경기` : ""}
      >
        <div className="divide-y divide-gray-200">
          {selectedDate &&
            groupedGames[selectedDate]?.map((game, index) => (
              <GameCard
                key={game.id}
                id={game.id}
                playerGames={game.playerGames}
                scoreTeamA={game.scoreTeamA}
                scoreTeamB={game.scoreTeamB}
                isLastItem={index === groupedGames[selectedDate].length - 1}
              />
            ))}
        </div>
      </Modal>

      {sortedDates.length === 0 && (
        <div className="sport-card p-8 text-center text-gray-500">
          {dateRange === "all" && (!startDate || !endDate) ? (
            "조회할 기간을 선택해주세요."
          ) : (
            <>
              해당 기간에 등록된 경기가 없습니다.
              <br />
              <Link
                href="/games/new"
                className="text-green-600 hover:text-green-700 mt-2 inline-block"
              >
                첫 경기를 등록해보세요!
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
