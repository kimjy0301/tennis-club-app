import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 게임 조회를 위한 where 조건 설정
    const whereCondition = startDate && endDate ? {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } : {};

    // 모든 게임 조회
    const games = await prisma.game.findMany({
      where: whereCondition,
      include: {
        playerGames: {
          include: {
            player: true
          }
        },
      },
    });

    // 선수별 통계 계산
    const playerStats = new Map();

    games.forEach(game => {
      game.playerGames.forEach(playerGame => {
        const player = playerGame.player;
        const stats = playerStats.get(player.name) || {
          name: player.name,
          profileImage: player.profileImage,
          totalGames: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
        };

        stats.totalGames++;
        const isTeamAWinner = game.scoreTeamA > game.scoreTeamB;
        if ((playerGame.team === 'A' && isTeamAWinner) || (playerGame.team === 'B' && !isTeamAWinner)) {
          stats.wins++;
        } else {
          stats.losses++;
        }
        stats.winRate = (stats.wins / stats.totalGames) * 100;

        playerStats.set(player.name, stats);
      });
    });

    return NextResponse.json(Array.from(playerStats.values()));
  } catch (error) {
    console.error('Error calculating player stats:', error);
    return NextResponse.json(
      { error: 'Failed to calculate player stats' },
      { status: 500 }
    );
  }
} 