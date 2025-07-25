import { Whitelist } from '@commi-dashboard/db/generated/prisma/client';
import { prisma, PrismaTransaction, getTransactionClient } from '@commi-dashboard/db';
import { nanoid } from 'nanoid';
import * as referralService from '@/lib/services/referralService';
import { UserDTO } from '@/types/dto'
import { WhitelistDomain, ReferralDomain } from '@/types/domain'

export enum WhitelistStatus {
  REGISTERED = "REGISTERED",
  CAN_CLAIM = "CAN_CLAIM",
  CLAIMED = "CLAIMED"
}

// Repository functions
export async function createWhitelist(tx: PrismaTransaction, data: WhitelistDomain) {
  const client = getTransactionClient(tx);
  return client.whitelist.create({
    data: {
      userId: data.user.userId as number,
      twitterId: data.user.twitterId as string,
      referralCode: nanoid(6),
      status: data.status,
    },
  });
}

export async function updateWhitelist(tx: PrismaTransaction, data: WhitelistDomain) {
  const client = getTransactionClient(tx);
  return client.whitelist.update({
    where: {
      userId: data.user.userId as number,
    },
    data: {
      twitterId: data.user.twitterId as string,
      status: data.status,
    },
  });
}

export async function findWhitelistByTwitterId(tx: PrismaTransaction, twitterId: string) {
  const client = getTransactionClient(tx);
  return client.whitelist.findUnique({ where: { twitterId } });
}

export async function findWhitelistByReferralCode(tx: PrismaTransaction, code: string) {
  const client = getTransactionClient(tx);
  return client.whitelist.findUnique({ where: { referralCode: code } });
}

// Service functions
export async function getWhitelist(userId: number) {
  const whitelist = await prisma.whitelist.findUnique({ where: { userId } });
  
  if (whitelist != null) {
    const whitelistDomain: WhitelistDomain = {
      user: {
        userId: whitelist.userId,
        twitterId: whitelist.twitterId,
      },
      referralCode: whitelist.referralCode,
      status: whitelist.status,
    };
    return whitelistDomain;
  }
  return null;
}

export async function createWhitelistForUser(data: UserDTO, referralCode?: string) {
  let referrer: Whitelist | null = null;
  return await prisma.$transaction(async (tx) => {
    if (referralCode) {
      referrer = await findWhitelistByReferralCode(tx, referralCode);
    }
    if (referrer !== null) {
      const referralDomain: ReferralDomain = {
        referrerId: referrer.userId,
        referrerTwitterId: referrer.twitterId,
        refereeId: data.userId as number,
        refereeTwitterId: data.twitterId,
      };
      const referralResult = await referralService.createReferral(tx, referralDomain);
      if (!referralResult) throw new Error('Failed to create referral');
      const whitelistDomain: WhitelistDomain = {
        user: {
          userId: referrer.userId,
          twitterId: referrer.twitterId,
        },
        status: WhitelistStatus.CAN_CLAIM,
      };
      const updateResult = await updateWhitelist(tx, whitelistDomain);
      if (!updateResult) throw new Error('Failed to update referrer whitelist');
    }
    const whitelistDomain: WhitelistDomain = {
      user: {
        userId: data.userId,
        twitterId: data.twitterId,
      },
      referralCode,
      status: WhitelistStatus.REGISTERED,
    };
    const whitelistResult = await createWhitelist(tx, whitelistDomain);
    if (!whitelistResult) throw new Error('Failed to create whitelist');
    return {
      user: { userId: whitelistResult.userId, twitterId: whitelistResult.twitterId },
      status: whitelistResult.status,
    };
  });
}

export async function claimWhitelist(data: UserDTO) {
  const whitelistDomain: WhitelistDomain = {
    user: {
      userId: data.userId,
      twitterId: data.twitterId,
    },
    status: WhitelistStatus.CLAIMED,
  };
  return prisma.whitelist.update({
    where: {
      userId: data.userId as number,
    },
    data: {
      twitterId: data.twitterId as string,
      status: whitelistDomain.status,
    },
  });
} 