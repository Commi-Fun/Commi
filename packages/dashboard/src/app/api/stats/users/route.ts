import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({ where: { verified: true } });
    
    const topUsersByFollowers = await prisma.user.findMany({
      orderBy: { followersCount: 'desc' },
      take: 10,
      select: {
        id: true,
        handle: true,
        name: true,
        followersCount: true,
        tweetsCount: true,
        verified: true,
      },
    });

    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
      orderBy: { createdAt: 'asc' },
    });

    const aggregateStats = await prisma.user.aggregate({
      _avg: {
        followersCount: true,
        followingCount: true,
        tweetsCount: true,
        listedCount: true,
      },
    });

    const usersByMonth = userGrowth.reduce((acc, curr) => {
      const month = dayjs(curr.createdAt).format('MMM YYYY');
      acc[month] = (acc[month] || 0) + curr._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalUsers,
      verifiedUsers,
      topUsersByFollowers,
      usersByMonth,
      aggregateStats,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}