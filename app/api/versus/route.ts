import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const player1Id = parseInt(searchParams.get('player1') || '');
    const player2Id = parseInt(searchParams.get('player2') || '');

    if (!player1Id || !player2Id) {
      return NextResponse.json(
        { error: 'Both player IDs are required' },
        { status: 400 }
      );
    }

    const games = await prisma.game.findMany({
      where: {
        AND: [
          {
            playerGames: {
              some: {
                playerId: player1Id
              }
            }
          },
          {
            playerGames: {
              some: {
                playerId: player2Id
              }
            }
          }
        ]
      },
      include: {
        playerGames: {
          include: {
            player: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    const filteredGames = games.filter(game => {
      const player1Game = game.playerGames.find(pg => pg.player.id === player1Id);
      const player2Game = game.playerGames.find(pg => pg.player.id === player2Id);
      
      return player1Game?.team !== player2Game?.team;
    });

    return NextResponse.json({ games: filteredGames });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch versus games' },
      { status: 500 }
    );
  }
} 