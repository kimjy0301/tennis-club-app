import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PlayerStats {
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
}

export async function GET() {
  try {
    // 모든 게임과 플레이어 데이터를 가져옴
    const games = await prisma.game.findMany({
      include: {
        players: true,
      },
    });

    // 플레이어별 통계를 계산
    const playerStatsMap = new Map<string, PlayerStats>();

    games.forEach(game => {
      game.players.forEach(player => {
        const isTeamA = player.team === 'A';
        const didWin = isTeamA ? game.scoreTeamA > game.scoreTeamB : game.scoreTeamB > game.scoreTeamA;

        if (!playerStatsMap.has(player.name)) {
          playerStatsMap.set(player.name, {
            name: player.name,
            totalGames: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
          });
        }

        const stats = playerStatsMap.get(player.name)!;
        stats.totalGames += 1;
        if (didWin) {
          stats.wins += 1;
        } else {
          stats.losses += 1;
        }
        stats.winRate = (stats.wins / stats.totalGames) * 100;
      });
    });

    // Map을 배열로 변환하고 승률 기준으로 정렬
    const playerStats = Array.from(playerStatsMap.values()).sort((a, b) => b.winRate - a.winRate);

    return NextResponse.json(playerStats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player stats' },
      { status: 500 }
    );
  }
} 