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

    const referrersWithUsers = await Promise.all(
      topReferrers.map(async (referrer) => {
        const user = await prisma.user.findFirst({
          where: { twitterId: referrer.referrerTwitterId },
          select: { handle: true, name: true, verified: true },
        });
        return {
          id: referrer.referrerId,
          referrerId: referrer.referrerId,
          referrerTwitterId: referrer.referrerTwitterId,
          referralCount: referrer._count.refereeId,
          ...user,
        };
      })
    );

    const recentReferrals = await prisma.referral.findMany({
      orderBy: { id: 'desc' },
      take: 20,
    });

    const recentReferralsWithUsers = await Promise.all(
      recentReferrals.map(async (referral) => {
        const [referrer, referee] = await Promise.all([
          prisma.user.findFirst({
            where: { twitterId: referral.referrerTwitterId },
            select: { handle: true, name: true },
          }),
          prisma.user.findFirst({
            where: { twitterId: referral.refereeTwitterId },
            select: { handle: true, name: true },
          }),
        ]);
        return {
          ...referral,
          referrer,
          referee,
        };
      })
    );

    const uniqueReferrers = await prisma.referral.findMany({
      distinct: ['referrerId'],
      select: { referrerId: true },
    });

    const avgReferralsPerReferrer = totalReferrals / (uniqueReferrers.length || 1);

    return NextResponse.json({
      totalReferrals,
      topReferrers: referrersWithUsers,
      recentReferrals: recentReferralsWithUsers,
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