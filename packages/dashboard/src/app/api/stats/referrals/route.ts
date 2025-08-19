import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalReferrals = await prisma.referral.count();

    const topReferrers = await prisma.referral.groupBy({
      by: ['referrerId', 'referrerTwitterId'],
      _count: {
        refereeId: true,
      },
      orderBy: {
        _count: {
          refereeId: 'desc',
        },
      },
      take: 10,
    });

    const referrersWithInfo = await Promise.all(
      topReferrers.map(async (referrer) => {
        const user = await prisma.user.findUnique({
          where: { id: referrer.referrerId },
          select: {
            handle: true,
            profileImageUrl: true,
          },
        });
        
        return {
          id: referrer.referrerId,
          referrerId: referrer.referrerId,
          referrerTwitterId: referrer.referrerTwitterId,
          referralCount: referrer._count.refereeId,
          handle: user?.handle,
          profileImageUrl: user?.profileImageUrl,
        };
      })
    );

    const recentReferrals = await prisma.referral.findMany({
      orderBy: { id: 'desc' },
      take: 20,
    });

    const uniqueReferrers = await prisma.referral.findMany({
      distinct: ['referrerId'],
      select: { referrerId: true },
    });

    const avgReferralsPerReferrer = totalReferrals / (uniqueReferrers.length || 1);

    return NextResponse.json({
      totalReferrals,
      topReferrers: referrersWithInfo,
      recentReferrals,
      uniqueReferrersCount: uniqueReferrers.length,
      avgReferralsPerReferrer,
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}