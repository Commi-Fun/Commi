import { Whitelist } from '@commi-dashboard/db/generated/prisma/client'
import { prisma, PrismaTransaction, getTransactionClient } from '@commi-dashboard/db'
import { nanoid } from 'nanoid'
import * as referralService from '@/lib/services/referralService'
import { UserDTO, WhitelistDto } from '@/types/dto'
import { WhitelistDomain, ReferralDomain } from '@/types/domain'
import { ValidationError, NotFoundError, ConflictError, DatabaseError } from '@/lib/utils/errors'
import { ServiceResult, createSuccessResult, createErrorResult } from '@/lib/utils/serviceResult'

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
export async function getWhitelist(twitterId: string): Promise<ServiceResult<WhitelistDto | null>> {
  try {
    const whitelist = await prisma.whitelist.findUnique({ where: { twitterId: twitterId } })

    if (whitelist != null) {
      const whitelistDto: WhitelistDto = {
        referralCode: whitelist.referralCode,
        status: whitelist.status,
      }
      return createSuccessResult(whitelistDto)
    }
    return createSuccessResult(null)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to get whitelist')
  }
}

export async function post(data: UserDTO): Promise<ServiceResult<WhitelistDto>> {
  try {
    const result = await prisma.whitelist.update({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
        status: WhitelistStatus.REGISTERED,
      },
      data: {
        status: WhitelistStatus.POSTED,
      }
    })
    const whitelistDto: WhitelistDto = {
      referralCode: result.referralCode,
      status: result.status,
    }
    return createSuccessResult(whitelistDto)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to update whitelist status')
  }
}

export async function refer(data: UserDTO, referralCode?: string): Promise<ServiceResult<any>> {
  try {
    if (!referralCode) {
      throw new ValidationError('Invalid referral code');
    }
    await prisma.$transaction(async tx => {
      const referrer = await findWhitelistByReferralCode(tx, referralCode)
      if (!referrer) {
        throw new NotFoundError("Referrer not found")
      }
      const referralDomain: ReferralDomain = {
        referrerId: referrer.userId,
        referrerTwitterId: referrer.twitterId,
        refereeId: data.userId as number,
        refereeTwitterId: data.twitterId,
      }
      const referralResult = await referralService.createReferral(tx, referralDomain)
      if (!referralResult) throw new DatabaseError('Failed to create referral')
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
        if (!updateResult) throw new DatabaseError('Failed to update referrer whitelist')
      }
    })
    return createSuccessResult(null)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to process referral')
  }
}

export async function claimWhitelist(data: UserDTO): Promise<ServiceResult<WhitelistDto>> {
  try {
    const whitelist = await prisma.whitelist.findUnique({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
      }
    })
    if (whitelist == null) {
      throw new NotFoundError('Not permitted to claim')
    }else if (whitelist.status === WhitelistStatus.REGISTERED || whitelist.status === WhitelistStatus.POSTED) {
      throw new ValidationError('Not permitted to claim')
    }else if (whitelist.status === WhitelistStatus.CLAIMED) {
      throw new ConflictError('Already claimed')
    }
    const result = await prisma.whitelist.update({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
      },
      data: {
        status: WhitelistStatus.CLAIMED,
      },
    })
    const whitelistDto: WhitelistDto = {
      status: result.status
    }
    return createSuccessResult(whitelistDto)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to claim whitelist')
  }
}

export async function listReferees(twitterId: string): Promise<ServiceResult<UserDTO[]>> {
  try {
    const referrals = await prisma.referral.findMany({
      where: { referrerTwitterId: twitterId },
    })

    if (referrals.length === 0) {
      return createSuccessResult([])
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
      twitterId: referee.twitterId,
      name: referee.name,
      handle: referee.handle,
      profileImageUrl: referee.profileImageUrl || "",
    }))

    return createSuccessResult(result)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to list referees')
  }
}
