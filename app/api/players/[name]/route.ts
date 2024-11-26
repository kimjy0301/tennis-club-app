import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const player = await prisma.player.findUnique({
      where: {
        id: parseInt(name)
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
    const intId = parseInt(id);
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profileImage = formData.get('profileImage') as File | null;

    let imageUrl = undefined;
    if (profileImage) {
      const { url } = await put(`profiles/${Date.now()}-${profileImage.name}`, profileImage, {
        access: 'public',
      });
      imageUrl = url;

    }

    const player = await prisma.player.update({
      where: { id: intId },
      data: {
        name,
        ...(imageUrl && { profileImage: imageUrl }),
      },
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