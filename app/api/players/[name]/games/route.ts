import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereCondition: any = {
      playerGames: {
        some: {
          player: {
            name: decodeURIComponent(name)
          }
        }
      }
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
            player: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching player games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player games' },
      { status: 500 }
    );
  }
} 