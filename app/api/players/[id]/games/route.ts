import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereCondition: {
      playerGames: {
        some: {
          player: {
            id: number;
          };
        };
      };
      date?: {
        gte: Date;
        lte: Date;
      };
    } = {
      playerGames: {
        some: {
          player: {
            id: parseInt(id),
          },
        },
      },
    };

    if (startDate && endDate) {
      whereCondition.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const games = await prisma.game.findMany({
      where: whereCondition,
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

    if (!games || games.length === 0) {
      return NextResponse.json({ games: [] });
    }

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Error fetching player games:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch player games",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
