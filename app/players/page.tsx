'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';

interface PlayerStats {
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface Game {
  id: number;
  date: string;
  scoreTeamA: number;
  scoreTeamB: number;
  players: {
    name: string;
    team: 'A' | 'B';
  }[];
}

type SortOption = 'winRate' | 'totalGames';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PlayerStats() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('winRate');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [dateRange, setDateRange] = useState<'month' | 'all'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let url = `${API_URL}/api/players/stats`;
        const params = new URLSearchParams();

        if (dateRange === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          params.append('startDate', monthAgo.toISOString());
          params.append('endDate', new Date().toISOString());
        } else if (dateRange === 'all' && startDate && endDate) {
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          params.append('startDate', new Date(startDate).toISOString());
          params.append('endDate', endDateTime.toISOString());
        }

        const queryString = params.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;
        
        const response = await fetch(finalUrl);
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange, startDate, endDate]);

  const fetchPlayerGames = async (playerName: string) => {
    setLoadingGames(true);
    try {
      let url = `${API_URL}/api/players/${encodeURIComponent(playerName)}/games`;
      const params = new URLSearchParams();

      if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        params.append('startDate', monthAgo.toISOString());
        params.append('endDate', new Date().toISOString());
      } else if (dateRange === 'all' && startDate && endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        params.append('startDate', new Date(startDate).toISOString());
        params.append('endDate', endDateTime.toISOString());
      }

      const queryString = params.toString();
      const finalUrl = queryString ? `${url}?${queryString}` : url;

      const response = await fetch(finalUrl);
      const data = await response.json();
      setPlayerGames(data);
    } catch (error) {
      console.error('Error fetching player games:', error);
    } finally {
      setLoadingGames(false);
    }
  };

  const handlePlayerClick = async (playerName: string) => {
    setSelectedPlayer(playerName);
    await fetchPlayerGames(playerName);
  };

  const getSortedPlayers = () => {
    return [...players].sort((a, b) => {
      if (sortBy === 'winRate') {
        return b.winRate - a.winRate;
      }
      return b.totalGames - a.totalGames;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

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
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-md flex-1 sm:flex-none ${
                dateRange === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              최근 1개월
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-4 py-2 rounded-md flex-1 sm:flex-none ${
                dateRange === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 기간
            </button>
          </div>
          
          {dateRange === 'all' && (
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
            key={player.name} 
            className="sport-card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handlePlayerClick(player.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{player.name}</h2>
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
     

      <Modal
        isOpen={selectedPlayer !== null}
        onClose={() => setSelectedPlayer(null)}
        title={`${selectedPlayer} 선수의 경기 기록`}
      >
        {loadingGames ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2 sm:px-4">
            {playerGames.map((game) => (
              <div 
                key={game.id} 
                className="bg-white rounded-xl border-2 border-gray-100 p-4 sm:p-6 hover:border-green-100 transition-colors"
              >
                {/* 날짜 배지 */}
                <div className="inline-block px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600 font-medium mb-4">
                  {formatDate(game.date)}
                </div>
                
                {/* 스코어 카드 */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex items-center justify-between">
                    {/* A팀 스코어 */}
                    <div className="flex-1 text-center">
                      <div className="text-sm font-medium text-gray-500 mb-1 sm:mb-2">A팀</div>
                      <div className={`text-2xl sm:text-3xl font-bold ${
                        (selectedPlayer && game.players.some(p => p.name === selectedPlayer && p.team === 'A')) 
                          ? 'text-green-600' 
                          : 'text-gray-700'
                      }`}>
                        {game.scoreTeamA}
                      </div>
                    </div>
                    
                    {/* VS 표시 */}
                    <div className="px-2 sm:px-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <span className="text-gray-400 font-medium text-sm sm:text-base">VS</span>
                      </div>
                    </div>
                    
                    {/* B팀 스코어 */}
                    <div className="flex-1 text-center">
                      <div className="text-sm font-medium text-gray-500 mb-1 sm:mb-2">B팀</div>
                      <div className={`text-2xl sm:text-3xl font-bold ${
                        (selectedPlayer && game.players.some(p => p.name === selectedPlayer && p.team === 'B')) 
                          ? 'text-green-600' 
                          : 'text-gray-700'
                      }`}>
                        {game.scoreTeamB}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 선수 목록 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* A팀 선수 */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="text-sm font-medium text-gray-500 mb-2 pb-2 border-b border-gray-200">
                      A팀 선수
                    </div>
                    <div className="space-y-2">
                      {game.players
                        .filter(p => p.team === 'A')
                        .map(p => (
                          <div 
                            key={p.name}
                            className={`px-3 py-1 rounded-full text-sm ${
                              p.name === selectedPlayer 
                                ? 'bg-green-100 text-green-700 font-medium' 
                                : 'bg-white text-gray-600'
                            }`}
                          >
                            {p.name}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  {/* B팀 선수 */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="text-sm font-medium text-gray-500 mb-2 pb-2 border-b border-gray-200">
                      B팀 선수
                    </div>
                    <div className="space-y-2">
                      {game.players
                        .filter(p => p.team === 'B')
                        .map(p => (
                          <div 
                            key={p.name}
                            className={`px-3 py-1 rounded-full text-sm ${
                              p.name === selectedPlayer 
                                ? 'bg-green-100 text-green-700 font-medium' 
                                : 'bg-white text-gray-600'
                            }`}
                          >
                            {p.name}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {playerGames.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                등록된 경기가 없습니다.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 