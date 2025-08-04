import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [userCount, whitelistCount, referralCount] = await Promise.all([
      prisma.user.count(),
      prisma.whitelist.count(),
      prisma.referral.count(),
    ]);

    const whitelistStatusCounts = await prisma.whitelist.groupBy({
      by: ['status'],
      _count: true,
    });

    const verifiedUserCount = await prisma.user.count({
      where: { verified: true },
    });

    return NextResponse.json({
      userCount,
      verifiedUserCount,
      whitelistCount,
      referralCount,
      whitelistStatusCounts,
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview stats' },
      { status: 500 }
    );
  }
}