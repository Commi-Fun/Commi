import { Whitelist } from '@commi-dashboard/db/generated/prisma/client'
import { prisma, PrismaTransaction, getTransactionClient } from '@commi-dashboard/db'
import { nanoid } from 'nanoid'
import * as referralService from '@/lib/services/referralService'
import { UserDTO, WhitelistDto } from '@/types/dto'
import { WhitelistDomain, ReferralDomain } from '@/types/domain'
import { NotFoundError, DatabaseError, BadRequestError, ForbiddenError } from '@/lib/utils/errors'
import { ServiceResult, createSuccessResult, createErrorResult } from '@/lib/utils/serviceResult'
import { validateTweetLink, fetchTweetFromCDN, TweetDataResponse } from './twitterService'
import { url_prefix } from '../constants'

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
      registeredAt: new Date(),
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
    const result = await prisma.whitelist.findUnique({ where: { twitterId: twitterId } })

    console.log('result', result)

    if (result != null) {
      return createSuccessResult(entityToWhitelistDTO(result))
    }
    return createSuccessResult(null)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to get whitelist')
  }
}

export async function follow(data: UserDTO): Promise<ServiceResult<WhitelistDto>> {
  try {
    const userWhitelist = await prisma.whitelist.findUnique({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
      },
    })
    if (!userWhitelist) {
      throw new NotFoundError('User not found')
    }
    if (userWhitelist.followedAt != null) {
      throw new BadRequestError('Already followed')
    }

    const result = await prisma.whitelist.update({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
        followedAt: null,
      },
      data: {
        followedAt: new Date(),
      },
    })
    return createSuccessResult(entityToWhitelistDTO(result))
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to update whitelist status')
  }
}

export async function post(data: UserDTO, postLink: string): Promise<ServiceResult<WhitelistDto>> {
  const tweetId = validateTweetLink(postLink)
  if (tweetId == null) {
    throw new BadRequestError('Invalid post link')
  }
  try {
    const tweetData = await fetchTweetFromCDN(tweetId)
    if (tweetData == null || validatePost(tweetData)) {
      throw new BadRequestError('Invalid post content')
    }
    if (tweetData.author !== data.twitterId) {
      throw new ForbiddenError('Not post owner')
    }

    const userWhitelist = await prisma.whitelist.findUnique({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
      },
    })
    if (!userWhitelist) {
      throw new NotFoundError('User not found')
    }
    if (userWhitelist.postedAt != null) {
      throw new BadRequestError('Already posted')
    }

    const result = await prisma.whitelist.update({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
        postedAt: null,
      },
      data: {
        postLink: postLink,
        postedAt: new Date(),
      },
    })
    return createSuccessResult(entityToWhitelistDTO(result))
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to update whitelist status')
  }
}

export async function refer(user: UserDTO, referralCode?: string): Promise<ServiceResult<any>> {
  try {
    if (!referralCode) {
      throw new BadRequestError('Invalid referral code')
    }

    await prisma.$transaction(async tx => {
      const referrer = await findWhitelistByReferralCode(tx, referralCode)

      if (user.userId === referrer?.userId) {
        throw new ForbiddenError('Cannot refer yourself')
      }

      if (!referrer) {
        throw new NotFoundError('Referrer not found')
      }

      const hasRefered = await tx.referral.findFirst({
        where: {
          refereeId: user.userId,
        },
      })

      if (hasRefered) {
        throw new BadRequestError('Already referred')
      }

      const mutuallyRefer = await tx.referral.findFirst({
        where: {
          referrerId: user.userId,
          refereeId: referrer.userId,
        },
      })

      if (mutuallyRefer) {
        throw new BadRequestError('Cannot get mutually refer')
      }

      const referralDomain: ReferralDomain = {
        referrerId: referrer.userId,
        referrerTwitterId: referrer.twitterId,
        refereeId: user.userId as number,
        refereeTwitterId: user.twitterId,
      }

      const referralResult = await referralService.createReferral(tx, referralDomain)

      if (!referralResult) throw new DatabaseError('Failed to create referral')

      if (!referrer.referredAt) {
        const updateResult = await tx.whitelist.update({
          where: {
            userId: referrer.userId,
            referredAt: null,
          },
          data: {
            referredAt: new Date(),
          },
        })
        if (!updateResult) console.log('Update referrer status error:', referralDomain)
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
      },
    })
    if (whitelist == null) {
      throw new ForbiddenError('Not permitted to claim')
    } else if (
      whitelist.registeredAt === null ||
      whitelist.followedAt === null ||
      whitelist.postedAt === null ||
      whitelist.referredAt === null
    ) {
      throw new ForbiddenError('Not permitted to claim')
    } else if (whitelist.claimedAt !== null) {
      throw new BadRequestError('Already claimed')
    }
    const result = await prisma.whitelist.update({
      where: {
        userId: data.userId,
        twitterId: data.twitterId,
        claimedAt: null,
      },
      data: {
        claimedAt: new Date(),
      },
    })
    return createSuccessResult(entityToWhitelistDTO(result))
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
      profileImageUrl: referee.profileImageUrl || '',
    }))

    return createSuccessResult(result)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to list referees')
  }
}

function validatePost(data: TweetDataResponse): boolean {
  if (data == null) {
    return false
  }
  for (const url in data.urls) {
    if (url.includes(url_prefix)) {
      return true
    }
  }
  return false
}

function entityToWhitelistDTO(entity: Whitelist): WhitelistDto {
  return {
    referralCode: entity.referralCode,
    registered: entity.registeredAt != null,
    followed: entity.followedAt != null,
    posted: entity.postedAt != null,
    referred: entity.referredAt != null,
    claimed: entity.claimedAt != null,
  }
}
