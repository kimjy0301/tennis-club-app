import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate that playerGames array exists
    if (!body.playerGames || !Array.isArray(body.playerGames)) {
      return NextResponse.json(
        { error: "playerGames array is required" },
        { status: 400 }
      );
    }

    // playerGames 배열을 가공하여 게스트와 등록된 플레이어를 구분 처리
    const processedPlayerGames = await Promise.all(
      body.playerGames.map(
        async (pg: {
          team: string;
          playerId?: number;
          guestPlayerName?: string;
        }) => {
          if (pg.playerId) {
            return {
              team: pg.team,
              playerId: pg.playerId,
            };
          } else {
            // 동일한 이름의 플레이어가 있는지 먼저 확인
            const existingPlayer = await prisma.player.findFirst({
              where: {
                name: pg.guestPlayerName,
              },
            });

            // 기존 플레이어가 있으면 그 플레이어 사용, 없으면 새로 생성
            const player =
              existingPlayer ||
              (await prisma.player.create({
                data: {
                  name: pg.guestPlayerName || "",
                  isGuest: true,
                },
              }));

            return {
              team: pg.team,
              playerId: player.id,
            };
          }
        }
      )
    );

    const game = await prisma.game.create({
      data: {
        date: new Date(body.date),
        scoreTeamA: body.scoreTeamA,
        scoreTeamB: body.scoreTeamB,
        playerGames: {
          create: processedPlayerGames,
        },
      },
      include: {
        playerGames: {
          include: {
            player: true,
          },
        },
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        playerGames: {
          include: {
            player: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
