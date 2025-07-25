import { prisma, PrismaTransaction } from '@commi-dashboard/db';
import { ReferralDomain } from '@/types/domain'

export async function createReferral(tx: PrismaTransaction, data: ReferralDomain) {
  return prisma.referral.create({
    data: {
      referrerId: data.referrerId,
      referrerTwitterId: data.referrerTwitterId,
      refereeId: data.refereeId,
      refereeTwitterId: data.refereeTwitterId,
    },
  });
} 