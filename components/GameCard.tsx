import Link from 'next/link';

interface Player {
  id: number;
  name: string;
  profileImage?: string;
}

interface PlayerGame {
  id: number;
  player: Player;
  playerId: number;
  gameId: number;
  team: string;
}

interface GameCardProps {
  id: number;
  playerGames: PlayerGame[];
  scoreTeamA: number;
  scoreTeamB: number;
  isLastItem: boolean;
}

export default function GameCard({ id, playerGames = [], scoreTeamA, scoreTeamB, isLastItem }: GameCardProps) {


  console.log("!!!!");
  console.log(playerGames);

  return (
    <Link
      href={`/games/${id}`}
      className={`block hover:bg-gray-50 transition-colors ${
        !isLastItem ? 'border-b border-gray-200' : ''
      }`}
    >
      <div className="p-2 sm:p-4">
        <div className="grid grid-cols-11 gap-1 sm:gap-4 items-center">
          {/* A팀 (왼쪽) */}
          <div className="col-span-3 text-right">
            <div className="space-y-0.5 sm:space-y-1">
              {playerGames?.filter(pg => pg.team === 'A')
                .map((playerGame) => (
                  <div key={playerGame.id} className="text-gray-700 text-sm sm:text-base truncate">
                    {playerGame.player.name}
                  </div>
                ))}
            </div>
            <div className={`text-base sm:text-lg font-bold mt-1 sm:mt-2 ${
              scoreTeamA > scoreTeamB ? 'text-blue-600' : 'text-gray-600'
            }`}>
              A팀
            </div>
          </div>

          {/* 점수 (가운데) */}
          <div className="col-span-5 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {scoreTeamA}
              <span className="text-gray-400 mx-1 sm:mx-2">:</span>
              {scoreTeamB}
            </div>
          </div>

          {/* B팀 (오른쪽) */}
          <div className="col-span-3 text-left">
            <div className="space-y-0.5 sm:space-y-1">
              {playerGames?.filter(pg => pg.team === 'B')
                .map((playerGame) => (
                  <div key={playerGame.id} className="text-gray-700 text-sm sm:text-base truncate">
                    {playerGame.player.name}
                  </div>
                ))}
            </div>
            <div className={`text-base sm:text-lg font-bold mt-1 sm:mt-2 ${
              scoreTeamA < scoreTeamB ? 'text-blue-600' : 'text-gray-600'
            }`}>
              B팀
            </div>
          </div>
        </div>
        
        {/* 승리 표시 */}
        <div className="text-center mt-1 sm:mt-2 text-xs sm:text-sm">
          <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
            scoreTeamA > scoreTeamB 
              ? 'bg-blue-50 text-blue-600'
              : 'bg-blue-50 text-blue-600'
          }`}>
            {scoreTeamA > scoreTeamB ? 'A팀 승리' : 'B팀 승리'}
          </span>
        </div>
      </div>
    </Link>
  );
} 