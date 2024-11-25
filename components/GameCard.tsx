import Link from 'next/link';

interface Player {
  name: string;
  team: 'A' | 'B';
}

interface GameCardProps {
  id: string;
  players: Player[];
  scoreTeamA: number;
  scoreTeamB: number;
  isLastItem: boolean;
}

export default function GameCard({ id, players, scoreTeamA, scoreTeamB, isLastItem }: GameCardProps) {
  return (
    <Link
      href={`/games/${id}`}
      className={`block hover:bg-gray-50 transition-colors ${
        !isLastItem ? 'border-b border-gray-200' : ''
      }`}
    >
      <div className="p-4">
        <div className="grid grid-cols-7 gap-4 items-center">
          {/* A팀 (왼쪽) */}
          <div className="col-span-3 text-right">
            <div className="space-y-1">
              {players
                .filter(p => p.team === 'A')
                .map((player, idx) => (
                  <div key={idx} className="text-gray-700">
                    {player.name}
                  </div>
                ))}
            </div>
            <div className={`text-lg font-bold mt-2 ${
              scoreTeamA > scoreTeamB ? 'text-blue-600' : 'text-gray-600'
            }`}>
              A팀
            </div>
          </div>

          {/* 점수 (가운데) */}
          <div className="col-span-1 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {scoreTeamA}
              <span className="text-gray-400 mx-2">:</span>
              {scoreTeamB}
            </div>
          </div>

          {/* B팀 (오른쪽) */}
          <div className="col-span-3 text-left">
            <div className="space-y-1">
              {players
                .filter(p => p.team === 'B')
                .map((player, idx) => (
                  <div key={idx} className="text-gray-700">
                    {player.name}
                  </div>
                ))}
            </div>
            <div className={`text-lg font-bold mt-2 ${
              scoreTeamA < scoreTeamB ? 'text-blue-600' : 'text-gray-600'
            }`}>
              B팀
            </div>
          </div>
        </div>
        
        {/* 승리 표시 */}
        <div className="text-center mt-2 text-sm">
          <span className={`inline-block px-3 py-1 rounded-full ${
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