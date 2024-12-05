"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Player {
  id: number;
  name: string;
  profileImage?: string;
}

interface PlayerGame {
  id: number;
  player: Player;
  team: string;
}

interface GameResult {
  id: number;
  date: string;
  playerGames: PlayerGame[];
  scoreTeamA: number;
  scoreTeamB: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function GameDetail() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [previousDate, setPreviousDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games/${params.id}`);
        const data = await response.json();
        setGame(data);

        if (data) {
          const date = new Date(data.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          });
          setPreviousDate(date);
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("정말로 이 경기 기록을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/games/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (previousDate) {
          router.push(`/games?date=${encodeURIComponent(previousDate)}`);
        } else {
          router.push("/");
        }
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackToList = () => {
    if (previousDate) {
      router.push(`/games?date=${encodeURIComponent(previousDate)}`);
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!game) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          경기를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const winningTeam =
    game.scoreTeamA > game.scoreTeamB
      ? "A"
      : game.scoreTeamA < game.scoreTeamB
      ? "B"
      : "무승부";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 테니스 코트 스타일의 헤더 */}
        <div className="bg-green-600 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl md:text-2xl font-bold">경기 상세</h1>
            <div className="text-sm md:text-lg">
              {new Date(game.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </div>
          </div>
        </div>

        {/* 스코어보드 */}
        <div className="bg-gray-800 text-white p-6">
          <div className="grid grid-cols-3 gap-4 items-center text-center">
            <div
              className={`text-2xl font-bold ${
                winningTeam === "A" ? "text-yellow-400" : ""
              }`}
            >
              A팀
            </div>
            <div className="text-2xl md:text-4xl font-bold">
              {game.scoreTeamA} - {game.scoreTeamB}
            </div>
            <div
              className={`text-2xl font-bold ${
                winningTeam === "B" ? "text-yellow-400" : ""
              }`}
            >
              B팀
            </div>
          </div>
        </div>

        {/* 선수 명단 */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className={`p-4 rounded-lg ${
                winningTeam === "A" ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">A팀 선수</h2>
              <div className="space-y-2">
                {game.playerGames
                  .filter((pg) => pg.team === "A")
                  .map((playerGame) => (
                    <div
                      key={playerGame.id}
                      className="bg-white p-3 rounded-lg shadow-sm"
                    >
                      {playerGame.player.name}
                    </div>
                  ))}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                winningTeam === "B" ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">B팀 선수</h2>
              <div className="space-y-2">
                {game.playerGames
                  .filter((pg) => pg.team === "B")
                  .map((playerGame) => (
                    <div
                      key={playerGame.id}
                      className="bg-white p-3 rounded-lg shadow-sm"
                    >
                      {playerGame.player.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* 승리 팀 표시 */}
        <div className="p-6 border-t border-gray-200">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-yellow-400 text-gray-900 rounded-full font-bold">
              {winningTeam === "무승부"
                ? "무승부 🤝"
                : `${winningTeam}팀 승리 🏆`}
            </div>
          </div>
        </div>

        {/* 작업 버튼 */}
        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <button
            onClick={handleBackToList}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 목록으로 돌아가기
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "삭제 중..." : "경기 삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
