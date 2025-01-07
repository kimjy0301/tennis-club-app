import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 게임 조회를 위한 where 조건 설정
    const whereCondition =
      startDate && endDate
        ? {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {};

    // 모든 게임 조회
    const games = await prisma.game.findMany({
      where: whereCondition,
      include: {
        playerGames: {
          include: {
            player: true,
          },
        },
      },
    });

    // 선수별 통계 계산
    const playerStats = new Map();

    // 먼저 모든 선수의 업적 점수를 계산
    for (const game of games) {
      for (const playerGame of game.playerGames) {
        const player = playerGame.player;
        // 기존 통계 초기화에 achievements 점수 합계 추가
        const stats = playerStats.get(player.id) || {
          id: player.id,
          name: player.name,
          profileImage: player.profileImage,
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          score: 0,
          achievementsScore: 0,
        };

        // 아직 업적 점수가 계산되지 않은 경우에만 계산
        if (!stats.achievementsCalculated) {
          // 해당 선수의 모든 업적 조회
          const achievementsWhereCondition: {
            playerId: number;
            date?: {
              gte?: Date;
              lte?: Date;
            };
          } = {
            playerId: player.id,
          };

          // startDate와 endDate가 있는 경우 날짜 조건 추가
          if (startDate && endDate) {
            achievementsWhereCondition.date = {
              gte: new Date(startDate),
              lte: new Date(endDate),
            };
          }

          const achievements = await prisma.achievement.findMany({
            where: achievementsWhereCondition,
          });

          // 업적 점수 합산을 achievementsScore에 저장
          stats.achievementsScore = achievements.reduce(
            (sum, achievement) => sum + achievement.points,
            0
          );
          stats.score += stats.achievementsScore; // 전체 점수에 업적 점수 추가
          stats.achievementsCalculated = true;
        }

        playerStats.set(player.id, stats);
      }
    }

    // 게임 점수 계산 (수정된 로직)
    const attendanceCheck = new Map(); // 출석 체크를 위한 Map 추가

    games.forEach((game) => {
      game.playerGames.forEach((playerGame) => {
        const player = playerGame.player;
        const stats = playerStats.get(player.id) || {
          id: player.id,
          name: player.name,
          profileImage: player.profileImage,
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          score: 0,
          achievementsScore: 0,
        };

        // 출석 점수 체크 (하루에 한번만)
        const gameDate = game.date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        const playerAttendance = attendanceCheck.get(player.id) || new Set();

        if (!playerAttendance.has(gameDate)) {
          stats.score += 2; // 출석 점수 +2
          playerAttendance.add(gameDate);
          attendanceCheck.set(player.id, playerAttendance);
        }

        stats.totalGames++;

        const isTeamAWinner = game.scoreTeamA > game.scoreTeamB;
        const isDraw = game.scoreTeamA === game.scoreTeamB;

        if (isDraw) {
          // 무승부 점수 +2
          stats.score += 2;
          stats.draws++;
        } else if (
          (playerGame.team === "A" && isTeamAWinner) ||
          (playerGame.team === "B" && !isTeamAWinner)
        ) {
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
        rank: index + 1,
      }));

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Error calculating rankings:", error);
    return NextResponse.json(
      { error: "Failed to calculate rankings" },
      { status: 500 }
    );
  }
}
