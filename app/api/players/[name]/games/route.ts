import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    
    // 해당 선수가 참여한 모든 게임을 찾습니다
    const games = await prisma.game.findMany({
      where: {
        players: {
          some: {
            name: decodeURIComponent(name)
          }
        }
      },
      include: {
        players: true
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