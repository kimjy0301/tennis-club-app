'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Player {
  id: number;
  name: string;
}

export default function NewGame() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamA, setTeamA] = useState<number[]>([]);
  const [teamB, setTeamB] = useState<number[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      setError('선수 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const playerGames = [
      ...teamA.map(id => ({ playerId: id, team: 'A' })),
      ...teamB.map(id => ({ playerId: id, team: 'B' }))
    ];

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          scoreTeamA: scoreA,
          scoreTeamB: scoreB,
          playerGames,
        }),
      });

      if (!response.ok) throw new Error('Failed to create game');
      router.push('/games');
    } catch (error) {
      setError('경기 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getAvailablePlayers = (team: 'A' | 'B', currentIndex: number) => {
    const selectedPlayers = team === 'A' ? teamA : teamB;
    const otherTeamPlayers = team === 'A' ? teamB : teamA;
    
    return players.filter(player => 
      !otherTeamPlayers.includes(player.id) && 
      (!selectedPlayers.includes(player.id) || selectedPlayers[currentIndex] === player.id)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">경기 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 날짜 선택 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            경기 날짜
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="tennis-input w-full text-lg py-3"
          />
        </div>

        {/* 점수 입력 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">점수</h2>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">A팀</label>
              <input
                type="number"
                min="0"
                value={scoreA}
                onChange={(e) => setScoreA(parseInt(e.target.value) || 0)}
                className="tennis-input w-full text-center text-2xl py-3"
              />
            </div>
            <div className="text-center text-gray-500">VS</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">B팀</label>
              <input
                type="number"
                min="0"
                value={scoreB}
                onChange={(e) => setScoreB(parseInt(e.target.value) || 0)}
                className="tennis-input w-full text-center text-2xl py-3"
              />
            </div>
          </div>
        </div>

        {/* 선수 선택 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">선수 선택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* A팀 선수 선택 */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">A팀</h3>
              <div className="space-y-3">
                {[0, 1].map((index) => (
                  <select
                    key={`A-${index}`}
                    value={teamA[index] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value ? parseInt(e.target.value) : undefined;
                      const newTeamA = [...teamA];
                      if (newValue) {
                        newTeamA[index] = newValue;
                      } else {
                        newTeamA.splice(index, 1);
                      }
                      setTeamA(newTeamA.filter(Boolean));
                    }}
                    className="tennis-input w-full py-3"
                  >
                    <option value="">선수 선택</option>
                    {getAvailablePlayers('A', index).map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            {/* B팀 선수 선택 */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">B팀</h3>
              <div className="space-y-3">
                {[0, 1].map((index) => (
                  <select
                    key={`B-${index}`}
                    value={teamB[index] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value ? parseInt(e.target.value) : undefined;
                      const newTeamB = [...teamB];
                      if (newValue) {
                        newTeamB[index] = newValue;
                      } else {
                        newTeamB.splice(index, 1);
                      }
                      setTeamB(newTeamB.filter(Boolean));
                    }}
                    className="tennis-input w-full py-3"
                  >
                    <option value="">선수 선택</option>
                    {getAvailablePlayers('B', index).map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="tennis-button w-full py-4 text-lg"
        >
          {loading ? '등록 중...' : '경기 등록'}
        </button>
      </form>
    </div>
  );
}
