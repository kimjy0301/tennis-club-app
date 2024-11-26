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
        const stats = playerStats.get(player.id) || {
          id: player.id,
          name: player.name,
          profileImage: player.profileImage,
          totalGames: 0,
          wins: 0,
          losses: 0,
          score: 0,
        };

        // 출석 점수 +2
        stats.score += 2;
        stats.totalGames++;

        const isTeamAWinner = game.scoreTeamA > game.scoreTeamB;
        if ((playerGame.team === 'A' && isTeamAWinner) || 
            (playerGame.team === 'B' && !isTeamAWinner)) {
          // 승리 점수 +3
          stats.score += 3;
          stats.wins++;
        } else {
          // 패배 점수 +1
          stats.score += 1;
          stats.losses++;
        }

        playerStats.set(player.id, stats);
      });
    });

    // Map을 배열로 변환하고 점수 기준으로 정렬
    const rankings = Array.from(playerStats.values())
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }));

    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Error calculating rankings:', error);
    return NextResponse.json(
      { error: 'Failed to calculate rankings' },
      { status: 500 }
    );
  }
} 