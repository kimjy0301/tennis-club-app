"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GameHistoryModal from "@/components/GameHistoryModal";
import { Game, Achievement } from "@/types/game";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
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
  id: string;
  gameDifference: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Home() {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<Achievement[]>(
    []
  );
  const [loadingGames, setLoadingGames] = useState(false);

  const [showScoreInfo, setShowScoreInfo] = useState(false);

  // 현재 기간 계산을 위한 함수
  const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // 환경변수에서 기간 설정 가져오기 (quarter 또는 half)
    const periodType = process.env.NEXT_PUBLIC_PERIOD_TYPE || "quarter";

    if (periodType === "half") {
      // 상반기/하반기
      const isFirstHalf = month <= 6;
      const startMonth = isFirstHalf ? 0 : 6;
      const endMonth = isFirstHalf ? 5 : 11;

      return {
        title: `${year}년 ${isFirstHalf ? "상반기" : "하반기"}`,
        startDate: new Date(year, startMonth, 1),
        endDate: new Date(
          year,
          endMonth,
          new Date(year, endMonth + 1, 0).getDate(),
          23,
          59,
          59,
          999
        ),
      };
    } else {
      // 분기별
      const quarter = Math.ceil(month / 3);
      const startMonth = (quarter - 1) * 3;
      const endMonth = quarter * 3;

      return {
        title: `${year}년 ${quarter}분기`,
        startDate: new Date(year, startMonth, 1),
        endDate: new Date(
          year,
          endMonth - 1,
          new Date(year, endMonth, 0).getDate(),
          23,
          59,
          59,
          999
        ),
      };
    }
  };

  const [currentPeriod, setCurrentPeriod] = useState(getCurrentPeriod());

  // 이전 기간으로 이동하는 함수
  const goToPreviousPeriod = () => {
    const periodType = process.env.NEXT_PUBLIC_PERIOD_TYPE || "quarter";
    const newDate = new Date(currentPeriod.startDate);

    if (periodType === "half") {
      // 상반기/하반기 이동
      newDate.setMonth(newDate.getMonth() - 6);
    } else {
      // 분기 이동
      newDate.setMonth(newDate.getMonth() - 3);
    }

    const newPeriod = getPeriodForDate(newDate);
    setCurrentPeriod(newPeriod);
  };

  // 다음 기간으로 이동하는 함수
  const goToNextPeriod = () => {
    const periodType = process.env.NEXT_PUBLIC_PERIOD_TYPE || "quarter";
    const newDate = new Date(currentPeriod.startDate);

    if (periodType === "half") {
      // 상반기/하반기 이동
      newDate.setMonth(newDate.getMonth() + 6);
    } else {
      // 분기 이동
      newDate.setMonth(newDate.getMonth() + 3);
    }

    const newPeriod = getPeriodForDate(newDate);
    setCurrentPeriod(newPeriod);
  };

  // 특정 날짜의 기간 정보를 가져오는 함수
  const getPeriodForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const periodType = process.env.NEXT_PUBLIC_PERIOD_TYPE || "quarter";

    if (periodType === "half") {
      const isFirstHalf = month <= 6;
      const startMonth = isFirstHalf ? 0 : 6;
      const endMonth = isFirstHalf ? 5 : 11;

      return {
        title: `${year}년 ${isFirstHalf ? "상반기" : "하반기"}`,
        startDate: new Date(year, startMonth, 1),
        endDate: new Date(
          year,
          endMonth,
          new Date(year, endMonth + 1, 0).getDate(),
          23,
          59,
          59,
          999
        ),
      };
    } else {
      const quarter = Math.ceil(month / 3);
      const startMonth = (quarter - 1) * 3;
      const endMonth = quarter * 3;

      return {
        title: `${year}년 ${quarter}분기`,
        startDate: new Date(year, startMonth, 1),
        endDate: new Date(
          year,
          endMonth - 1,
          new Date(year, endMonth, 0).getDate(),
          23,
          59,
          59,
          999
        ),
      };
    }
  };

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const params = new URLSearchParams({
          startDate: currentPeriod.startDate.toISOString(),
          endDate: currentPeriod.endDate.toISOString(),
        });

        const response = await fetch(`${API_URL}/api/rankings?${params}`);
        const data = await response.json();

        setRankings(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [currentPeriod]);

  const handlePlayerClick = async (playerId: string) => {
    const player = rankings.find((r) => r.id === playerId);
    setSelectedPlayer(player?.name || null);
    setLoadingGames(true);

    try {
      const period = getCurrentPeriod();
      const params = new URLSearchParams({
        startDate: period.startDate.toISOString(),
        endDate: period.endDate.toISOString(),
      });

      const url = `${API_URL}/api/players/${playerId}/games`;
      const achievementsUrl = `${API_URL}/api/players/achievements/${playerId}`;

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
      console.error("Error fetching player data:", error);
    } finally {
      setLoadingGames(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousPeriod}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-white"
            title="이전 기간"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentPeriod.title} 랭킹
          </h1>
          <button
            onClick={goToNextPeriod}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-white"
            title="다음 기간"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => setShowScoreInfo(true)}
            className="fixed bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-2xl text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 z-50 border-2 border-white/30 backdrop-blur-sm"
            title="점수 계산 방식"
          >
            <span className="text-2xl font-bold">?</span>
          </button>
          <Link href="/rankings" className="tennis-button">
            전체 랭킹 보기
          </Link>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="md:hidden mb-6">
        {/* 1등 */}
        <div
          key={rankings[0]?.name}
          className="sport-card pt-10 pb-6 px-6 text-center relative overflow-visible transition-all duration-300 mb-6 bg-gradient-to-b from-yellow-50 to-white cursor-pointer hover:scale-105"
          onClick={() => rankings[0]?.id && handlePlayerClick(rankings[0].id)}
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce z-50">
            👑
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/20 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300"></div>

          <div className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-yellow-400 animate-pulse text-xl shadow-lg">
            1
          </div>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce z-50">
            👑
          </div>

          {/* 1등 내용 */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl mt-8">
            <Image
              src={rankings[0]?.profileImage || "/default-profile.png"}
              alt={`${rankings[0]?.name} 프로필`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-green-800">
              {rankings[0]?.name}
            </h2>
            <p className="text-4xl font-bold my-4">
              <span className="text-green-600">{rankings[0]?.score}점</span>
            </p>
            <div className="text-sm text-gray-600">
              <p>
                승/패/무: {rankings[0]?.wins}/{rankings[0]?.losses}/
                {rankings[0]?.draws}
                <span
                  className={`ml-1 text-xs ${
                    rankings[0]?.gameDifference > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ({rankings[0]?.gameDifference > 0 ? "+" : ""}
                  {rankings[0]?.gameDifference})
                </span>
              </p>
              <p>입상: {rankings[0]?.achievementsScore}점</p>
            </div>
          </div>
        </div>

        {/* 2등, 3등 */}
        <div className="grid grid-cols-1 gap-6">
          {[rankings[1], rankings[2]].map((player, index) => (
            <div
              key={player?.name}
              className="sport-card p-6 text-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => player?.id && handlePlayerClick(player.id)}
            >
              {/* 순위 뱃지 */}
              <div
                className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                  index === 0 ? "bg-gray-400" : "bg-orange-400"
                }`}
              >
                {index + 2}
              </div>

              {/* 프로필 이미지 */}
              <div
                className={`w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-lg mt-6 ${
                  index === 0 ? "border-gray-400" : "border-orange-400"
                }`}
              >
                <Image
                  src={player?.profileImage || "/default-profile.png"}
                  alt={`${player?.name} 프로필`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-bold text-green-800">
                  {player?.name}
                </h2>
                <p className="text-3xl font-bold my-4">
                  <span className="text-green-600">{player?.score}점</span>
                </p>
                <div className="text-sm text-gray-600">
                  <p>
                    승/패/무: {player?.wins}/{player?.losses}/{player?.draws}
                    <span
                      className={`ml-1 text-xs ${
                        player?.gameDifference > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ({player?.gameDifference > 0 ? "+" : ""}
                      {player?.gameDifference})
                    </span>
                  </p>
                  <p>입상: {player?.achievementsScore}점</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 데스크탑 레이아웃 */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 md:mb-14">
        {/* 2등 */}
        <div
          key={rankings[1]?.name}
          className="sport-card md:translate-y-4 p-6 text-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105"
          onClick={() => rankings[1]?.id && handlePlayerClick(rankings[1].id)}
        >
          {/* 순위 뱃지 */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gray-400 text-xl shadow-lg">
            2
          </div>

          {/* 프로필 이미지 추가 */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-400 shadow-xl mt-8">
            <Image
              src={rankings[1]?.profileImage || "/default-profile.png"}
              alt={`${rankings[1]?.name} 프로필`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-green-800">
              {rankings[1]?.name}
            </h2>
            <p className="text-4xl font-bold my-4">
              <span className="text-green-600">{rankings[1]?.score}점</span>
            </p>
            <div className="text-sm text-gray-600">
              <p>
                승/패/무: {rankings[1]?.wins}/{rankings[1]?.losses}/
                {rankings[1]?.draws}
                <span
                  className={`ml-1 text-xs ${
                    rankings[1]?.gameDifference > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ({rankings[1]?.gameDifference > 0 ? "+" : ""}
                  {rankings[1]?.gameDifference})
                </span>
              </p>
              <p>입상: {rankings[1]?.achievementsScore}점</p>
            </div>
          </div>
        </div>

        {/* 1등 */}
        <div
          key={rankings[0]?.name}
          className="sport-card pt-10 pb-6 px-6 text-center relative overflow-visible transition-all duration-300 bg-gradient-to-b from-yellow-50 to-white cursor-pointer hover:scale-105"
          onClick={() => rankings[0]?.id && handlePlayerClick(rankings[0].id)}
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce z-50">
            👑
          </div>
          {/* 순위 뱃지 */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-yellow-400 animate-pulse text-xl shadow-lg">
            1
          </div>

          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce z-50">
            👑
          </div>

          {/* 프로필 이미지 */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl mt-8">
            <Image
              src={rankings[0]?.profileImage || "/default-profile.png"}
              alt={`${rankings[0]?.name} 프로필`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-green-800">
              {rankings[0]?.name}
            </h2>
            <p className="text-4xl font-bold my-4">
              <span className="text-green-600">{rankings[0]?.score}점</span>
            </p>
            <div className="text-sm text-gray-600">
              <p>
                승/패/무: {rankings[0]?.wins}/{rankings[0]?.losses}/
                {rankings[0]?.draws}
                <span
                  className={`ml-1 text-xs ${
                    rankings[0]?.gameDifference > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ({rankings[0]?.gameDifference > 0 ? "+" : ""}
                  {rankings[0]?.gameDifference})
                </span>
              </p>
              <p>입상: {rankings[0]?.achievementsScore}점</p>
            </div>
          </div>
        </div>

        {/* 3등 */}
        <div
          key={rankings[2]?.name}
          className="sport-card md:translate-y-4 p-6 text-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105"
          onClick={() => rankings[2]?.id && handlePlayerClick(rankings[2].id)}
        >
          {/* 순위 뱃지 */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-orange-400 text-xl shadow-lg">
            3
          </div>
          {/* 프로필 이미지 추가 */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-400 shadow-xl mt-8">
            <Image
              src={rankings[2]?.profileImage || "/default-profile.png"}
              alt={`${rankings[2]?.name} 프로필`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-green-800">
              {rankings[2]?.name}
            </h2>
            <p className="text-4xl font-bold my-4">
              <span className="text-green-600">{rankings[2]?.score}점</span>
            </p>
            <div className="text-sm text-gray-600">
              <p>
                승/패/무: {rankings[2]?.wins}/{rankings[2]?.losses}/
                {rankings[2]?.draws}
                <span
                  className={`ml-1 text-xs ${
                    rankings[2]?.gameDifference > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ({rankings[2]?.gameDifference > 0 ? "+" : ""}
                  {rankings[2]?.gameDifference})
                </span>
              </p>
              <p>입상: {rankings[2]?.achievementsScore}점</p>
            </div>
          </div>
        </div>
      </div>

      {/* 나머지 랭킹 */}
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
                  점수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  승/패/무
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  입상
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.slice(3).map((player) => (
                <tr
                  key={player.name}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePlayerClick(player.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {player.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.wins}/{player.losses}/{player.draws}
                    <span
                      className={`ml-1 text-xs ${
                        player.gameDifference > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ({player.gameDifference > 0 ? "+" : ""}
                      {player.gameDifference})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.achievementsScore}
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

      <GameHistoryModal
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        playerName={selectedPlayer || ""}
        games={playerGames}
        loading={loadingGames}
        achievements={playerAchievements}
      />

      <ScoreInfoModal
        isOpen={showScoreInfo}
        onClose={() => setShowScoreInfo(false)}
      />
    </div>
  );
}
