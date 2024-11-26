import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profileImage = formData.get('profileImage') as File;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Upload image to Vercel Blob if provided
    let profileImageUrl = '';
    if (profileImage) {
      const blob = await put(`profiles/${Date.now()}-${profileImage.name}`, profileImage, {
        access: 'public',
      });
      profileImageUrl = blob.url;
    }

    const player = await prisma.player.create({
      data: {
        name,
        profileImage: profileImageUrl,
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