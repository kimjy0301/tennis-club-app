import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profileImage = formData.get('profileImage') as string;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: {
        name,
        profileImage,
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error registering player:', error);
    return NextResponse.json(
      { error: 'Failed to register player' },
      { status: 500 }
    );
  }
} 