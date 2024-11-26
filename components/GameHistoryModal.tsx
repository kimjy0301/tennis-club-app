import Modal from '@/components/Modal';
import { Game } from '@/types/game';

interface GameHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  games: Game[] | { games: Game[] };
  loading: boolean;
}

export default function GameHistoryModal({
  isOpen,
  onClose,
  playerName,
  games: gamesData,
  loading
}: GameHistoryModalProps) {
  const games = Array.isArray(gamesData) ? gamesData : gamesData?.games || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${playerName} 선수의 경기 기록`}
    >
       {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2 sm:px-4">
            {games.length > 0 ? (
              games.map((game) => (
                <div 
                  key={game.id} 
                  className="bg-white rounded-xl border-2 border-gray-100 p-4 sm:p-6 hover:border-green-100 transition-colors"
                >
                  {/* 날짜와 승패 배지 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600 font-medium">
                      {formatDate(game.date)}
                    </div>
                    {playerName && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        (game.playerGames.some(pg => pg.player.name === playerName && pg.team === 'A') && game.scoreTeamA > game.scoreTeamB) ||
                        (game.playerGames.some(pg => pg.player.name === playerName && pg.team === 'B') && game.scoreTeamB > game.scoreTeamA)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {(game.playerGames.some(pg => pg.player.name === playerName && pg.team === 'A') && game.scoreTeamA > game.scoreTeamB) ||
                         (game.playerGames.some(pg => pg.player.name === playerName && pg.team === 'B') && game.scoreTeamB > game.scoreTeamA)
                          ? '승'
                          : '패'}
                      </div>
                    )}
                  </div>
                  
                  {/* 스코어 카드 */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                    <div className="flex items-center justify-between">
                      {/* A팀 스코어 */}
                      <div className="flex-1 text-center">
                        <div className="text-sm font-medium text-gray-500 mb-1 sm:mb-2">A팀</div>
                        <div className={`text-2xl sm:text-3xl font-bold ${
                          (playerName && game.playerGames.some(pg => pg.player.name === playerName && pg.team === 'A')) 
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
                          (playerName && game.playerGames.some(pg => pg.player.name === playerName && pg.team === 'B')) 
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
                        {game.playerGames
                          .filter(pg => pg.team === 'A')
                          .map(pg => (
                            <div 
                              key={pg.player.name}
                              className={`px-3 py-1 rounded-full text-sm ${
                                pg.player.name === playerName 
                                  ? 'bg-green-100 text-green-700 font-medium' 
                                  : 'bg-white text-gray-600'
                              }`}
                            >
                              {pg.player.name}
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
                        {game.playerGames
                          .filter(pg => pg.team === 'B')
                          .map(pg => (
                            <div 
                              key={pg.player.name}
                              className={`px-3 py-1 rounded-full text-sm ${
                                pg.player.name === playerName 
                                  ? 'bg-green-100 text-green-700 font-medium' 
                                  : 'bg-white text-gray-600'
                              }`}
                            >
                              {pg.player.name}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                등록된 경기가 없습니다.
              </div>
            )}
          </div>
        )}
    </Modal>
  );
} 