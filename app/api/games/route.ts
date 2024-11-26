import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate that playerGames array exists
    if (!body.playerGames || !Array.isArray(body.playerGames)) {
      return NextResponse.json(
        { error: 'playerGames array is required' },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        date: new Date(body.date),
        scoreTeamA: body.scoreTeamA,
        scoreTeamB: body.scoreTeamB,
        playerGames: {
          create: body.playerGames,
        },
      },
      include: {
        playerGames: {
          include: {
            player: true
          }
        },
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
        playerGames: {
          include: {
            player: true
          }
        },
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