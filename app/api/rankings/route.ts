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
        players: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // 선수별 점수 계산
    const playerScores = new Map();
    // 선수별 출석일 추적
    const playerAttendanceDates = new Map();

    games.forEach(game => {
      const gameDate = game.date.toDateString(); // 날짜만 비교하기 위해 시간 제거

      game.players.forEach(player => {
        const currentScore = playerScores.get(player.name) || {
          name: player.name,
          totalGames: 0,
          wins: 0,
          losses: 0,
          score: 0,
        };

        // 해당 선수의 출석일 Set 가져오기
        const attendanceDates = playerAttendanceDates.get(player.name) || new Set();
        
        // 해당 날짜에 처음 출석한 경우에만 출석 점수 +2
        if (!attendanceDates.has(gameDate)) {
          currentScore.score += 2;
          attendanceDates.add(gameDate);
        }

        currentScore.totalGames++;

        const isTeamAWinner = game.scoreTeamA > game.scoreTeamB;
        if ((player.team === 'A' && isTeamAWinner) || 
            (player.team === 'B' && !isTeamAWinner)) {
          // 승리 점수 +3
          currentScore.score += 3;
          currentScore.wins++;
        } else {
          // 패배 점수 +1
          currentScore.score += 1;
          currentScore.losses++;
        }

        playerScores.set(player.name, currentScore);
        playerAttendanceDates.set(player.name, attendanceDates);
      });
    });

    // Map을 배열로 변환하고 점수 기준으로 정렬
    const rankings = Array.from(playerScores.values())
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