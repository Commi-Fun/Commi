import { Whitelist } from '@commi-dashboard/db/generated/prisma/client'
import { prisma, PrismaTransaction, getTransactionClient } from '@commi-dashboard/db'
import { nanoid } from 'nanoid'
import * as referralService from '@/lib/services/referralService'
import { UserDTO } from '@/types/dto'
import { WhitelistDomain, ReferralDomain } from '@/types/domain'
import { console } from 'inspector'

export enum WhitelistStatus {
  REGISTERED = 'REGISTERED',
  POSTED = 'POSTED',
  REFERRED = 'REFERRED',
  CLAIMED = 'CLAIMED',
}

// Repository functions
export async function createWhitelist(tx: PrismaTransaction, data: WhitelistDomain) {
  const client = getTransactionClient(tx)
  return client.whitelist.create({
    data: {
      userId: data.user.userId as number,
      twitterId: data.user.twitterId as string,
      referralCode: nanoid(6),
      status: data.status,
    },
  })
}

export async function updateWhitelist(tx: PrismaTransaction, data: WhitelistDomain) {
  const client = getTransactionClient(tx)
  return client.whitelist.update({
    where: {
      userId: data.user.userId as number,
    },
    data: {
      twitterId: data.user.twitterId,
      status: data.status,
    },
  })
}

export async function findWhitelistByTwitterId(tx: PrismaTransaction, twitterId: string) {
  const client = getTransactionClient(tx)
  return client.whitelist.findUnique({ where: { twitterId } })
}

export async function findWhitelistByReferralCode(tx: PrismaTransaction, code: string) {
  const client = getTransactionClient(tx)
  return client.whitelist.findUnique({ where: { referralCode: code } })
}

// Service functions
export async function getWhitelist(twitterId: string) {
  const whitelist = await prisma.whitelist.findUnique({ where: { twitterId: twitterId } })

  if (whitelist != null) {
    const whitelistDomain: WhitelistDomain = {
      user: {
        userId: whitelist.userId,
        twitterId: whitelist.twitterId,
      },
      referralCode: whitelist.referralCode,
      status: whitelist.status,
    }
    return whitelistDomain
  }
  return null
}

export async function post(data: UserDTO) {
  return prisma.whitelist.update({
    where: {
      userId: data.userId,
      twitterId: data.twitterId,
      status: WhitelistStatus.REGISTERED,
    },
    data: {
      status: WhitelistStatus.POSTED,
    }
  })
}

export async function refer(data: UserDTO, referralCode?: string) {
  if (!referralCode) {
    throw new Error('Invalid referral code');
  }
  return await prisma.$transaction(async tx => {
    const referrer = await findWhitelistByReferralCode(tx, referralCode)
    if (!referrer) {
      throw new Error("Referrer not found")
    }
    const referralDomain: ReferralDomain = {
      referrerId: referrer.userId,
      referrerTwitterId: referrer.twitterId,
      refereeId: data.userId as number,
      refereeTwitterId: data.twitterId,
    }
    const referralResult = await referralService.createReferral(tx, referralDomain)
    if (!referralResult) throw new Error('Failed to create referral')
    if (referrer.status === WhitelistStatus.REGISTERED || referrer.status === WhitelistStatus.POSTED) {
      const updateResult = await tx.whitelist.update({
        where: {
          userId: referrer.userId,
          status: referrer.status,
        },
        data: {
          status: WhitelistStatus.REFERRED,
        },
      })
      if (!updateResult) throw new Error('Failed to update referrer whitelist')
    }
  })
}

export async function claimWhitelist(data: UserDTO) {
  const whitelist = await prisma.whitelist.findUnique({
    where: {
      userId: data.userId,
      twitterId: data.twitterId,
    }
  })
  if (whitelist == null) {
    throw new Error('Not permitted to claim')
  }else if (whitelist.status === WhitelistStatus.REGISTERED || whitelist.status === WhitelistStatus.POSTED) {
    throw new Error('Not permitted to claim')
  }else if (whitelist.status === WhitelistStatus.CLAIMED) {
    throw new Error('Already claimed')
  }
  const whitelistDomain: WhitelistDomain = {
    user: {
      userId: data.userId,
      twitterId: data.twitterId,
    },
    status: WhitelistStatus.CLAIMED,
  }
  return prisma.whitelist.update({
    where: {
      userId: data.userId,
      twitterId: data.twitterId,
    },
    data: {
      status: whitelistDomain.status,
    },
  })
}

export async function listReferees(twitterId: string) {
  const referrals = await prisma.referral.findMany({
    where: { referrerTwitterId: twitterId },
  })

  if (referrals.length === 0) {
    return []
  }

  // Extract referee Twitter IDs from referrals
  const refereeTwitterIds = referrals.map(referral => referral.refereeTwitterId)

  // Get referee user info from User table
  const referees = await prisma.user.findMany({
    where: {
      twitterId: { in: refereeTwitterIds },
    },
  })

  // Map to UserDTO format
  const result = referees.map(referee => ({
    userId: referee.id,
    twitterId: referee.twitterId,
    name: referee.name,
    handle: referee.handle,
    profileImageUrl: referee.profileImageUrl,
  }))

  return result
}
