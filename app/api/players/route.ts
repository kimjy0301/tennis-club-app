import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: {
        playerGames: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { playerId } = await request.json();

    await prisma.$transaction([
      prisma.playerGame.deleteMany({
        where: { playerId: playerId },
      }),
      prisma.player.delete({
        where: { id: playerId },
      }),
    ]);

    return NextResponse.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    );
  }
}
