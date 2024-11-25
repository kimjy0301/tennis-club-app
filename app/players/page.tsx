'use client';

import { useState, useEffect } from 'react';

interface PlayerStats {
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PlayerStats() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/players/stats`);
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">선수별 전적</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {players.map((player) => (
          <div key={player.name} className="sport-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{player.name}</h2>
              <span className="tennis-ball text-2xl">🎾</span>
            </div>
            
            {/* 승률 프로그레스 바 */}
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
                <div className="text-lg font-bold text-green-600">{player.wins}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">패</div>
                <div className="text-lg font-bold text-red-600">{player.losses}</div>
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
    </div>
  );
} 