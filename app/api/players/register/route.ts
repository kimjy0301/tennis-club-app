import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profileImage = formData.get('profileImage') as File;

    if (!name || !profileImage) {
      return NextResponse.json(
        { error: 'Name and profile image are required' },
        { status: 400 }
      );
    }

    // Vercel Blob을 사용하여 이미지 업로드
    const { url } = await put(`profiles/${Date.now()}-${profileImage.name}`, profileImage, {
      access: 'public',
    });

    // DB에 선수 정보 저장 (imageUrl을 Blob URL로 변경)
    const player = await prisma.player.create({
      data: {
        name,
        profileImage: url, // Blob URL 사용
        team: 'A',
        game: {
          create: {
            date: new Date(),
            scoreTeamA: 0,
            scoreTeamB: 0
          }
        }
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