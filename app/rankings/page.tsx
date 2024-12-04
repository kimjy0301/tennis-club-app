"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ScoreInfoModal from "@/components/ScoreInfoModal";

interface RankingData {
  rank: number;
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  score: number;
  achievementsScore: number;
  profileImage?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"month" | "all">("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const url = `${API_URL}/api/rankings`;
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

        setRankings(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [dateRange, startDate, endDate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">랭킹</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setShowScoreInfo(true)}
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-2xl text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 z-50 border-2 border-white/30 backdrop-blur-sm"
          title="점수 계산 방식"
        >
          <span className="text-2xl font-bold">?</span>
        </button>
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

      {/* 랭킹 테이블 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순위
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  선수명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  입상
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  점수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  승/패/무
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((player) => (
                <tr key={player.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        player.rank <= 3 ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {player.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3">
                        <Image
                          src={player.profileImage || "/default-profile.png"}
                          alt={player.name}
                          className="object-cover rounded-full"
                          width={32}
                          height={32}
                          style={{ width: "32px", height: "32px" }}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {player.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {player.achievementsScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {player.score - player.achievementsScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {player.wins}/{player.losses}/{player.draws}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rankings.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          등록된 경기 기록이 없습니다.
        </div>
      )}
      <ScoreInfoModal
        isOpen={showScoreInfo}
        onClose={() => setShowScoreInfo(false)}
      />
    </div>
  );
}
