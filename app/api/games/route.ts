import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const game = await prisma.game.create({
      data: {
        date: new Date(body.date),
        scoreTeamA: body.scoreTeamA,
        scoreTeamB: body.scoreTeamB,
        players: {
          create: body.players.map((player: { name: string; team: 'A' | 'B' }) => ({
            name: player.name,
            team: player.team,
          })),
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        players: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}