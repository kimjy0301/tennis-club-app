import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/tournaments/[id]/players - 선수 추가
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { playerIds } = await request.json();
    const tournamentId = parseInt(id);

    // 토너먼트에 선수들 추가
    await Promise.all(
      playerIds.map((playerId: number) => {
        return prisma.tournamentPlayer.create({
          data: {
            tournamentId,
            playerId,
          },
        });
      })
    );

    // 업데이트된 토너먼트 정보 반환
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Failed to add players:", error);
    return NextResponse.json(
      { error: "Failed to add players to tournament" },
      { status: 500 }
    );
  }
}
