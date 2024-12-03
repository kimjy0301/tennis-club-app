import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/tournaments/[id]/matches/[matchId] - 경기 결과 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; matchId: string }> }
) {
  try {
    const { id, matchId } = await params;
    const body = await request.json();
    const { score1, score2, winnerId, playedAt } = body;

    const match = await prisma.tournamentMatch.update({
      where: {
        id: parseInt(matchId),
        tournamentId: parseInt(id),
      },
      data: {
        score1,
        score2,
        winnerId,
        playedAt: playedAt ? new Date(playedAt) : undefined,
      },
    });

    // 다음 라운드 매치 업데이트 (승자를 다음 매치의 선수로 설정)
    if (winnerId) {
      const nextRound = match.round + 1;
      const nextMatchOrder = Math.floor(match.matchOrder / 2);

      const nextMatch = await prisma.tournamentMatch.findFirst({
        where: {
          tournamentId: parseInt(id),
          round: nextRound,
          matchOrder: nextMatchOrder,
        },
      });

      if (nextMatch) {
        // 짝수 번호 매치의 승자는 다음 매치의 player1로
        // 홀수 번호 매치의 승자는 다음 매치의 player2로
        const updateData =
          match.matchOrder % 2 === 0
            ? { player1Id: winnerId }
            : { player2Id: winnerId };

        await prisma.tournamentMatch.update({
          where: { id: nextMatch.id },
          data: updateData,
        });
      }
    }

    return NextResponse.json(match);
  } catch {
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}
