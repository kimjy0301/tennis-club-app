import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await prisma.player.findUnique({
      where: { id: parseInt(id) },
      include: {
        playerGames: {
          include: {
            game: true
          }
        }
      }
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profileImage = formData.get('profileImage') as string | null;

    const updateData: {
      name: string;
      profileImage?: string;
    } = {
      name,
    };

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const player = await prisma.player.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 선수와 관련된 모든 playerGame 레코드를 먼저 삭제
    await prisma.playerGame.deleteMany({
      where: { playerId: parseInt(id) },
    });

    // 선수 삭제
    await prisma.player.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
} 