'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Game {
  id: string;
  date: string;
  scoreTeamA: number;
  scoreTeamB: number;
}

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">경기 기록</h1>
        <Link
          href="/games/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          새 경기 등록
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 gap-4 sm:gap-0">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="block hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(game.date).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-lg font-medium">
                      A팀 vs B팀
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {game.scoreTeamA} - {game.scoreTeamB}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {game.scoreTeamA > game.scoreTeamB ? 'A팀 승리' : 'B팀 승리'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {games.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            등록된 경기가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
} 