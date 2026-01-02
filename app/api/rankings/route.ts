import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const scoringMethod = process.env.NEXT_PUBLIC_SCORING_METHOD || "default";

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

    // 한 번에 모든 업적 조회
    const achievementsWhereCondition: {
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (startDate && endDate) {
      achievementsWhereCondition.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const allAchievements = await prisma.achievement.findMany({
      where: achievementsWhereCondition,
    });

    // 플레이어별 업적 점수를 미리 계산
    const playerAchievementScores = new Map();
    allAchievements.forEach((achievement) => {
      const currentScore =
        playerAchievementScores.get(achievement.playerId) || 0;
      playerAchievementScores.set(
        achievement.playerId,
        currentScore + achievement.points
      );
    });

    // 선수별 통계 계산
    const playerStats = new Map();

    // 게임 통계와 미리 계산된 업적 점수 합산
    for (const game of games) {
      for (const playerGame of game.playerGames) {
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
          gameDifference: 0,
        };

        // 미리 계산된 업적 점수 적용
        if (!stats.achievementsCalculated) {
          stats.achievementsScore = playerAchievementScores.get(player.id) || 0;
          stats.score += stats.achievementsScore;
          stats.achievementsCalculated = true;
        }

        playerStats.set(player.id, stats);
      }
    }

    if (scoringMethod === "default") {
      // 게임 점수 계산 (수정된 로직)
      const attendanceCheck = new Map(); // 출석 체크를 위한 Map 추가
      // 승리 점수는 환경 변수로 설정 가능 (기본값: 3점)
      const winPoints = parseInt(process.env.NEXT_PUBLIC_WIN_POINTS || "3", 10);

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
            goalDifference: 0,
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
            // 승리 점수 (환경 변수로 설정 가능)
            stats.score += winPoints;
            stats.wins++;
          } else {
            // 패배 점수 +1
            stats.score += 1;
            stats.losses++;
          }

          // 득실차 계산
          if (playerGame.team === "A") {
            stats.gameDifference += game.scoreTeamA - game.scoreTeamB;
          } else {
            stats.gameDifference += game.scoreTeamB - game.scoreTeamA;
          }

          playerStats.set(player.id, stats);
        });
      });
    } else if (scoringMethod === "TOP") {
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
            gameDifference: 0,
          };

          stats.totalGames++;

          const isTeamAWinner = game.scoreTeamA > game.scoreTeamB;
          const isDraw = game.scoreTeamA === game.scoreTeamB;

          if (isDraw) {
            stats.draws++;
          } else if (
            (playerGame.team === "A" && isTeamAWinner) ||
            (playerGame.team === "B" && !isTeamAWinner)
          ) {
            // 승리시에만 1점 부여
            stats.score += 1;
            stats.wins++;
          } else {
            stats.losses++;
          }

          // 득실차 계산
          if (playerGame.team === "A") {
            stats.gameDifference += game.scoreTeamA - game.scoreTeamB;
          } else {
            stats.gameDifference += game.scoreTeamB - game.scoreTeamA;
          }

          playerStats.set(player.id, stats);
        });
      });
    }
    // Map을 배열로 변환하고 점수 기준으로 정렬
    const rankings = Array.from(playerStats.values())
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // 먼저 점수로 정렬
        }
        return b.gameDifference - a.gameDifference; // 점수가 같으면 득실차로 정렬
      })
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
