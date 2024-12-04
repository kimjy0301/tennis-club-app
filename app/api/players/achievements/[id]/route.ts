import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// GET: 특정 선수의 모든 업적 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 기본 where 조건 설정
    const whereCondition: {
      playerId: number;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      playerId: parseInt(id),
    };

    // startDate와 endDate가 있는 경우 날짜 조건 추가
    if (startDate || endDate) {
      whereCondition.date = {};
      if (startDate) {
        whereCondition.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereCondition.date.lte = new Date(endDate);
      }
    }

    const achievements = await prisma.achievement.findMany({
      where: whereCondition,
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST: 새로운 업적 추가
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const rank = formData.get("rank") as string;
    const points = parseInt(formData.get("points") as string);
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    let imageUrl = "";
    if (image) {
      const blob = await put(
        `achievements/${Date.now()}-${image.name}`,
        image,
        {
          access: "public",
        }
      );
      imageUrl = blob.url;
    }

    const achievement = await prisma.achievement.create({
      data: {
        playerId: parseInt(id),
        title,
        rank,
        points,
        date: new Date(date),
        description,
        image: imageUrl || null,
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}

// DELETE: 업적 삭제 (필요한 경우 사용)
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const achievementId = url.searchParams.get("achievementId");

    if (!achievementId) {
      return NextResponse.json(
        { error: "Achievement ID is required" },
        { status: 400 }
      );
    }

    await prisma.achievement.delete({
      where: {
        id: parseInt(achievementId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 }
    );
  }
}
