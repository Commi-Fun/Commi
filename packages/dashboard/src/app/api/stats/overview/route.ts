import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET() {
  try {
    const [whitelistCount, referralCount] = await Promise.all([
      prisma.whitelist.count(),
      prisma.referral.count(),
    ]);

    const whitelistData = await prisma.whitelist.findMany({
      select: {
        claimedAt: true,
        referredAt: true,
        postedAt: true,
        followedAt: true,
        registeredAt: true,
        createdAt: true,
      },
    });

    // Calculate user growth by month
    const userGrowth = await prisma.whitelist.groupBy({
      by: ['createdAt'],
      _count: true,
      orderBy: { createdAt: 'asc' },
    });

    const usersByMonth = userGrowth.reduce((acc, curr) => {
      const month = dayjs(curr.createdAt).format('MMM YYYY');
      acc[month] = (acc[month] || 0) + curr._count;
      return acc;
    }, {} as Record<string, number>);

    // Calculate engagement stats
    const engaged = whitelistData.filter(u => 
      u.claimedAt || u.followedAt || u.postedAt || u.referredAt
    ).length;

    const claimed = whitelistData.filter(u => u.claimedAt).length;
    const followed = whitelistData.filter(u => u.followedAt).length;
    const posted = whitelistData.filter(u => u.postedAt).length;
    const referred = whitelistData.filter(u => u.referredAt).length;

    const engagementRate = whitelistCount > 0 ? (engaged / whitelistCount) * 100 : 0;

    return NextResponse.json({
      whitelistCount,
      referralCount,
      usersByMonth,
      engagementStats: {
        engaged,
        engagementRate,
        claimed,
        followed,
        posted,
        referred,
      },
      totalUsers: whitelistCount,
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview stats' },
      { status: 500 }
    );
  }
}