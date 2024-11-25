'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Player {
  name: string;
  team: 'A' | 'B';
}

interface GameResult {
  date: string;
  players: Player[];
  scoreTeamA: number;
  scoreTeamB: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function NewGame() {
  const router = useRouter();
  const [gameData, setGameData] = useState<GameResult>({
    date: new Date().toISOString().split('T')[0],
    players: [
      { name: '', team: 'A' },
      { name: '', team: 'A' },
      { name: '', team: 'B' },
      { name: '', team: 'B' }
    ],
    scoreTeamA: 0,
    scoreTeamB: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/api/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      await response.json();
      router.push('/');
    } catch (error) {
      console.error('Error creating game:', error);
      // 여기에 에러 처리 로직 추가 (예: 알림 표시)
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">새 경기 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">경기 날짜</label>
          <input
            type="date"
            value={gameData.date}
            onChange={(e) => setGameData({...gameData, date: e.target.value})}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">A팀</h2>
            {gameData.players.filter(p => p.team === 'A').map((player, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  선수 {idx + 1}
                </label>
                <input
                  type="text"
                  placeholder={`선수 이름`}
                  value={player.name}
                  onChange={(e) => {
                    const newPlayers = [...gameData.players];
                    newPlayers[idx].name = e.target.value;
                    setGameData({...gameData, players: newPlayers});
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">점수</label>
              <input
                type="number"
                value={gameData.scoreTeamA}
                onChange={(e) => setGameData({...gameData, scoreTeamA: parseInt(e.target.value) || 0})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">B팀</h2>
            {gameData.players.filter(p => p.team === 'B').map((player, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  선수 {idx + 1}
                </label>
                <input
                  type="text"
                  placeholder={`선수 이름`}
                  value={player.name}
                  onChange={(e) => {
                    const newPlayers = [...gameData.players];
                    newPlayers[idx + 2].name = e.target.value;
                    setGameData({...gameData, players: newPlayers});
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">점수</label>
              <input
                type="number"
                value={gameData.scoreTeamB}
                onChange={(e) => setGameData({...gameData, scoreTeamB: parseInt(e.target.value)})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          경기 결과 저장
        </button>
      </form>
    </div>
  );
}