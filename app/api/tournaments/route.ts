import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tournaments - 대회 목록 조회
export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { startDate: "desc" },
      include: {
        matches: {
          include: {
            player1: true,
            player2: true,
            winner: true,
          },
        },
      },
    });

    return NextResponse.json(tournaments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}

// POST /api/tournaments - 새 대회 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, description } = body;

    // 기본 유효성 검사
    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        status: "UPCOMING",
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 }
    );
  }
}
