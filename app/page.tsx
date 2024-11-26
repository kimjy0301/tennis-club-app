'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RankingData {
  rank: number;
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  score: number;
  profileImage?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // 최근 1개월 데이터만 가져오기
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const params = new URLSearchParams({
          startDate: monthAgo.toISOString(),
          endDate: new Date().toISOString(),
        });
        
        const response = await fetch(`${API_URL}/api/rankings?${params}`);
        const data = await response.json();

        console.log(data);
        setRankings(data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">이달의 랭킹</h1>
        <Link href="/rankings" className="tennis-button">
          전체 랭킹 보기
        </Link>
      </div>

      {/* Top 3 선수 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:items-end">
        {/* 2등 */}
        <div 
          key={rankings[1]?.name}
          className="sport-card p-6 text-center relative overflow-hidden transition-all duration-300"
        >
          {/* 순위 뱃지 */}
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gray-400">
            2
          </div>

          {/* 프로필 이미지 추가 */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src={rankings[1]?.profileImage || '/default-profile.png'} 
              alt={`${rankings[1]?.name} 프로필`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-900">
              {rankings[1]?.name}
            </h2>
            <p className="text-3xl font-bold my-4 text-green-600">
              {rankings[1]?.score}점
            </p>
            <div className="text-sm text-gray-600">
              <p>승/패: {rankings[1]?.wins}/{rankings[1]?.losses}</p>
              <p>참여: {rankings[1]?.totalGames}경기</p>
            </div>
          </div>
        </div>

        {/* 1등 */}
        <div 
          key={rankings[0]?.name}
          className="sport-card p-6 text-center relative overflow-hidden transition-all duration-300 md:-mt-12 md:shadow-xl scale-105 bg-gradient-to-b from-white to-yellow-50"
        >
          {/* 순위 뱃지 */}
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-yellow-400 animate-pulse">
            1
          </div>

          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="text-2xl">👑</span>
          </div>
          {/* 프로필 이미지 추가 */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src={rankings[0]?.profileImage || '/default-profile.png'} 
              alt={`${rankings[0]?.name} 프로필`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 scale-110">
            <h2 className="text-2xl font-bold text-green-800">
              {rankings[0]?.name}
            </h2>
            <p className="text-4xl font-bold my-4 text-green-600">
              {rankings[0]?.score}점
            </p>
            <div className="text-sm text-gray-600">
              <p>승/패: {rankings[0]?.wins}/{rankings[0]?.losses}</p>
              <p>참여: {rankings[0]?.totalGames}경기</p>
            </div>
          </div>
        </div>

        {/* 3등 */}
        <div 
          key={rankings[2]?.name}
          className="sport-card p-6 text-center relative overflow-hidden transition-all duration-300"
        >
          {/* 순위 뱃지 */}
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-orange-400">
            3
          </div>
          {/* 프로필 이미지 추가 */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src={rankings[2]?.profileImage || '/default-profile.png'} 
              alt={`${rankings[2]?.name} 프로필`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gray-900">
              {rankings[2]?.name}
            </h2>
            <p className="text-3xl font-bold my-4 text-green-600">
              {rankings[2]?.score}점
            </p>
            <div className="text-sm text-gray-600">
              <p>승/패: {rankings[2]?.wins}/{rankings[2]?.losses}</p>
              <p>참여: {rankings[2]?.totalGames}경기</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순위</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">선수명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">점수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">승/패</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.slice(3).map((player) => (
                <tr key={player.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.wins}/{player.losses}</td>
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
    </div>
  );
}