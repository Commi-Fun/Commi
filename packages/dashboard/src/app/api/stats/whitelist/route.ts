import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalWhitelist = await prisma.whitelist.count();
    
    const statusCounts = await prisma.whitelist.groupBy({
      by: ['status'],
      _count: true,
    });

    const recentWhitelist = await prisma.whitelist.findMany({
      orderBy: { id: 'desc' },
      take: 20,
    });

    const recentWhitelistWithUsers = await Promise.all(
      recentWhitelist.map(async (whitelist) => {
        const user = await prisma.user.findFirst({
          where: { twitterId: whitelist.twitterId },
          select: {
            handle: true,
            name: true,
            verified: true,
          },
        });
        return {
          ...whitelist,
          user,
        };
      })
    );

    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalWhitelist,
      statusMap,
      recentWhitelist: recentWhitelistWithUsers,
    });
  } catch (error) {
    console.error('Error fetching whitelist stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whitelist stats' },
      { status: 500 }
    );
  }
}