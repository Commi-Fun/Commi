import { Whitelist } from 'packages/db/generated/prisma/client';
import { prisma } from 'packages/db/src/index';
import * as whitelistRepository from '../repositories/whitelistRepository';
import * as referralRepository from '../repositories/referralRepository';
import { UserDTO } from '../types/dto'
import { WhitelistDomain, ReferralDomain } from '../types/domain'

export async function getWhitelist(twitterId: string) {
  const whitelist = await whitelistRepository.findWhitelistByTwitterId(prisma, twitterId);
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

export async function createWhitelist(data: UserDTO, referralCode?: string) {
  let referrer: Whitelist | null = null;
  return await prisma.$transaction(async (tx) => {
    if (referralCode) {
      referrer = await whitelistRepository.findWhitelistByReferralCode(tx, referralCode);
    }
    if (referrer !== null) {
      const referralDomain: ReferralDomain = {
        referrerId: referrer.userId,
        referrerTwitterId: referrer.twitterId,
        refereeId: data.userId as number,
        refereeTwitterId: data.twitterId,
      };
      const referralResult = await referralRepository.createReferral(tx, referralDomain);
      if (!referralResult) throw new Error('Failed to create referral');
      const whitelistDomain: WhitelistDomain = {
        user: {
          userId: referrer.userId,
          twitterId: referrer.twitterId,
        },
        status: whitelistRepository.WhitelistStatus.CAN_CLAIM,
      };
      const updateResult = await whitelistRepository.updateWhitelist(tx, whitelistDomain);
      if (!updateResult) throw new Error('Failed to update referrer whitelist');
    }
    const whitelistDomain: WhitelistDomain = {
      user: {
        userId: data.userId,
        twitterId: data.twitterId,
      },
      referralCode,
      status: whitelistRepository.WhitelistStatus.REGISTERED,
    };
    const whitelistResult = await whitelistRepository.createWhitelist(tx, whitelistDomain);
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
    status: whitelistRepository.WhitelistStatus.CLAIMED,
  };
  return whitelistRepository.updateWhitelist(prisma, whitelistDomain);
} 