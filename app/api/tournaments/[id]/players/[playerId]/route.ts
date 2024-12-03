import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/tournaments/[id]/players/[playerId] - 선수 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; playerId: string }> }
) {
  try {
    const { id, playerId } = await params;
    const tournamentId = parseInt(id);
    const playerIdNum = parseInt(playerId);

    // 토너먼트와 선수 존재 여부 먼저 확인
    const existingPlayer = await prisma.tournamentPlayer.findUnique({
      where: {
        id: playerIdNum,
      },
    });

    if (!existingPlayer) {
      return NextResponse.json(
        { error: "Player not found in tournament" },
        { status: 404 }
      );
    }

    // 토너먼트에서 선수 제거
    await prisma.tournamentPlayer.delete({
      where: {
        id: playerIdNum,
      },
    });

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
    console.error("Failed to remove player:", error);

    // 구체적인 에러 메시지 처리
    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        return NextResponse.json(
          { error: "Player not found in tournament" },
          { status: 404 }
        );
      }
      if (error.message.includes("Foreign key constraint failed")) {
        return NextResponse.json(
          { error: "Cannot delete player due to existing references" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to remove player from tournament" },
      { status: 500 }
    );
  }
}
