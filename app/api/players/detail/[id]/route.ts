import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET - 선수 정보 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await prisma.player.findUnique({
      where: { id: parseInt(id) },
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

// PUT - 선수 정보 수정
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const profileImage = formData.get('profileImage') as File | null;

    let imageUrl;
    if (profileImage) {
      // Vercel Blob으로 이미지 업로드
      const timestamp = Date.now();
      const fileName = `${timestamp}-${profileImage.name}`;
      const blob = await put(`profiles/${fileName}`, profileImage, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    const player = await prisma.player.update({
      where: { id: parseInt(id) },
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

// DELETE - 선수 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 선수가 존재하는지 확인
    const existingPlayer = await prisma.player.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // 선수와 관련된 모든 데이터 삭제 (트랜잭션 사용)
    await prisma.$transaction([
      // 1. 먼저 PlayerGame 테이블의 관련 레코드 삭제
      prisma.playerGame.deleteMany({
        where: { playerId: parseInt(id) },
      }),
      // 2. 그 다음 Player 테이블에서 선수 삭제
      prisma.player.delete({
        where: { id: parseInt(id) },
      }),
    ]);

    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}

// PATCH - 선수 정보 부분 수정
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const formData = await request.formData();
    const { id } = await params;
    
    const updateData: {
      name?: string;
      profileImage?: string;
    } = {};

    const name = formData.get('name');
    const profileImage = formData.get('profileImage') as File | null;

    if (name) updateData.name = name as string;
    if (profileImage) {
      // Vercel Blob으로 이미지 업로드
      const timestamp = Date.now();
      const fileName = `${timestamp}-${profileImage.name}`;
      const blob = await put(`profiles/${fileName}`, profileImage, {
        access: 'public',
      });
      updateData.profileImage = blob.url;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No data provided for update' },
        { status: 400 }
      );
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