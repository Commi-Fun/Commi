import { prisma, PrismaTransaction } from 'packages/db/src/index';
import { ReferralDomain } from 'packages/web/src/api/models/domain'

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