import { CampaignDomain } from '@/types/domain'
import { UserDTO, CreateCampaignRequestDto, CampaignResponseDto, LeaderboardDto } from '@/types/dto'
import { Campaign, CampaignStatus, Prisma, prisma } from '@commi-dashboard/db'
import { createErrorResult, createSuccessResult, ServiceResult } from '../utils/serviceResult'
import { BadRequestError, NotFoundError } from '../utils/errors'
import dayjs from 'dayjs'
import { ISocialLinks } from '@/types/campaign'
import { JsonObject } from '@commi-dashboard/db/generated/prisma/client/runtime/library'
import { nanoid } from 'nanoid'

// Service Functions
export async function list(
  page: number,
  pageSize: number,
): Promise<ServiceResult<Array<CampaignResponseDto>>> {
  try {
    const campaigns = await findOngoingCampaigns(page, pageSize)
    if (!campaigns || campaigns.length === 0) {
      return createSuccessResult([])
    }

    const result: CampaignResponseDto[] = []
    const campaignIds = campaigns.map(c => c.id)
    const participationCountMap: Map<number, number> = new Map()

    // Get participation counts
    const counts = await prisma.$queryRaw<
      Array<{ campaignId: number; count: bigint }>
    >`SELECT p."campaignId", count(*) as count FROM public."Participation" p WHERE p."campaignId" = ANY(${campaignIds}::int[]) GROUP BY p."campaignId"`
    for (const c of counts) {
      participationCountMap.set(c.campaignId, Number(c.count))
    }

    for (const campaign of campaigns) {
      const participationCount = participationCountMap.get(campaign.id) ?? 0
      const responseDto = toCampaignResponseDto(campaign)
      responseDto.participationCount = participationCount
      result.push(responseDto)
    }

    return createSuccessResult(result)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get campaigns'
    return createErrorResult(errorMessage)
  }
}

export async function get(
  user: UserDTO | null,
  uid: string,
): Promise<ServiceResult<CampaignResponseDto>> {
  try {
    const campaign = await findCampaignByUid(uid)
    if (!campaign) {
      throw new NotFoundError('Campaign not found.')
    }
    const responseDto = toCampaignResponseDto(campaign)

    // Get creator name
    const creator = await prisma.user.findUnique({
      where: { id: campaign.creatorId },
      select: { name: true, profileImageUrl: true, handle: true, twitterId: true },
    })
    responseDto.creator = {
      twitterId: creator?.twitterId ?? '',
      name: creator?.name,
      profileImageUrl: creator?.profileImageUrl ?? '',
      handle: creator?.handle,
    }

    // Get participation count
    const participationCount = await prisma.participation.count({
      where: { campaignId: campaign.id },
    })
    responseDto.participationCount = participationCount

    // Check if user claimable amount
    if (user?.userId) {
      const unclaimedRecords = await prisma.claimRecord.findMany({
        where: {
          userId: Number(user.userId),
          campaignId: campaign.id,
          claimed: false,
        },
        select: {
          amount: true,
        },
      })
      responseDto.claimed = unclaimedRecords.length > 0
      responseDto.claimableAmount = unclaimedRecords.reduce(
        (acc, record) => acc + Number(record.amount),
        0,
      )
    }

    // Get leaderboard
    // const leaderboard = await prisma.leaderboard.findMany({
    //   where: { campaignId: campaign.id },
    //   orderBy: { score: 'desc' },
    // })

    const leaderboardUsers = await prisma.$queryRaw<
      Array<{
        twitterId: string
        twitterHandle: string
        rank: number
        score: number
        airdropAmount: string
        percentage: number
      }>
    >`SELECT u."twitterId", u."handle" as twitterHandle, l."rank", l."score", l."airdropAmount", l."percentage" FROM public."Leaderboard" l WHERE l."campaignId" = ${campaign.id} INNER JOIN public."User" u ON l."twitterId" = u."twitterId"`
    responseDto.leaderboard = leaderboardUsers.map(lb => ({
      twitterId: lb.twitterId,
      twitterHandle: lb.twitterHandle,
      rank: lb.rank,
      score: lb.score,
      airdropAmount: Number(lb.airdropAmount),
      percentage: lb.percentage,
    })) as LeaderboardDto[]
    return createSuccessResult(responseDto)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get campaign'
    return createErrorResult(errorMessage)
  }
}

export async function create(
  user: UserDTO,
  data: CreateCampaignRequestDto,
): Promise<ServiceResult<{ id: number }>> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.twitterId },
    })
    if (!dbUser) {
      throw new NotFoundError('User not found.')
    }

    if (data.totalAmount <= 0) {
      throw new BadRequestError('Invalid token amount.')
    }

    if (data.duration <= 0) {
      throw new BadRequestError('Invalid duration.')
    }

    const campaignDomain = toCampaignDomain(data, dbUser.id)
    const result = await createCampaign(campaignDomain)

    return createSuccessResult({ id: result.id })
  } catch (error: unknown) {
    // console.log('error', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create campaign'
    return createErrorResult(errorMessage)
  }
}

export async function joinCampaign(user: UserDTO, campaignId: number): Promise<ServiceResult> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
    })
    if (!dbUser) {
      throw new NotFoundError('User not found.')
    }
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })
    if (!campaign) {
      throw new NotFoundError('Campaign not found.')
    }
    if (campaign.status !== CampaignStatus.ONGOING) {
      throw new BadRequestError('Campaign is not ongoing.')
    }
    if (dayjs(campaign.endTime).isBefore(dayjs())) {
      throw new BadRequestError('Campaign has ended.')
    }
    if (Number(campaign.remainingAmount) <= 0) {
      throw new BadRequestError('Campaign has no remaining amount.')
    }

    const existingParticipation = await prisma.participation.findFirst({
      where: {
        userId: dbUser.id,
        campaignId: campaignId,
      },
    })
    if (existingParticipation) {
      throw new BadRequestError('User has already joined the campaign.')
    }

    await prisma.participation.create({
      data: {
        userId: dbUser.id,
        campaignId: campaignId,
        twitterId: user.twitterId,
      },
    })

    return createSuccessResult(null)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to join campaign'
    return createErrorResult(errorMessage)
  }
}

export async function claim(
  user: UserDTO,
  campaignId: number,
  txHash: string,
): Promise<ServiceResult> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
    })
    if (!dbUser) {
      throw new NotFoundError('User not found.')
    }

    if (!txHash) {
      throw new BadRequestError('Invalid transaction hash.')
    }

    await prisma.claimRecord.updateMany({
      where: {
        userId: user.userId as number,
        campaignId: campaignId,
        claimed: false,
      },
      data: {
        txHash: txHash,
        claimed: true,
      },
    })
    return createSuccessResult(null)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to claim campaign'
    return createErrorResult(errorMessage)
  }
}

export async function listUserParticipatedCampaigns(
  user: UserDTO,
): Promise<ServiceResult<Array<CampaignResponseDto>>> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.twitterId },
    })
    if (!dbUser) {
      throw new NotFoundError('User not found.')
    }

    // Find all campaigns the user has participated in
    const participations = await prisma.participation.findMany({
      where: { twitterId: dbUser.twitterId },
      orderBy: { createdAt: 'desc' },
    })

    if (!participations || participations.length === 0) {
      return createSuccessResult([])
    }

    const campaignIds = participations.map(p => p.campaignId)

    // Get the campaigns
    const campaigns = await prisma.campaign.findMany({
      where: { id: { in: campaignIds } },
    })

    if (!campaigns || campaigns.length === 0) {
      return createSuccessResult([])
    }

    const result: CampaignResponseDto[] = []

    // Check claim status for each campaign
    const canClaimRecords = await prisma.claimRecord.findMany({
      where: {
        userId: dbUser.id,
        campaignId: { in: campaignIds },
        claimed: false,
      },
      select: {
        campaignId: true,
        amount: true,
      },
    })
    const claimMap = new Map(canClaimRecords.map(record => [record.campaignId, record.amount]))

    for (const campaign of campaigns) {
      const responseDto = toCampaignResponseDto(campaign)
      const claimableAmount = claimMap.get(campaign.id) ?? '0'
      responseDto.claimed = Number(claimableAmount) === 0
      responseDto.claimableAmount = Number(claimableAmount)
      result.push(responseDto)
    }

    return createSuccessResult(result)
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to get user participated campaigns'
    return createErrorResult(errorMessage)
  }
}

// Repository Functions
export async function createCampaign(data: CampaignDomain) {
  return prisma.campaign.create({
    data: {
      uid: nanoid(32),
      description: data.description,
      tokenAddress: data.tokenAddress,
      tokenName: data.tokenName,
      ticker: data.ticker,
      marketCap: data.marketCap.toString(),
      totalAmount: data.totalAmount.toString(),
      remainingAmount: data.totalAmount.toString(),
      startTime: data.startTime,
      endTime: data.endTime,
      tags: data.tags,
      rewardRound: data.rewardRound,
      socialLinks: data.socialLinks as unknown as JsonObject,
      status: data.status as CampaignStatus,
      creatorId: data.creatorId,
      txHash: data.txHash,
    },
  })
}

export async function findCampaignByUid(uid: string) {
  return prisma.campaign.findUnique({ where: { uid } })
}

export async function findOngoingCampaigns(page: number, pageSize: number) {
  return prisma.campaign.findMany({
    where: { status: CampaignStatus.ONGOING },
    orderBy: { startTime: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })
}

export async function updateCampaign(id: number, data: Prisma.CampaignUpdateInput) {
  return prisma.campaign.update({
    where: { id },
    data,
  })
}

export async function deleteCampaign(id: number) {
  await prisma.campaign.delete({ where: { id } })
}

// Transformation functions
function toCampaignResponseDto(campaign: Campaign): CampaignResponseDto {
  const campaignDuration = dayjs(campaign.endTime).diff(campaign.startTime, 'hour')
  const roundInterval = campaignDuration / campaign.rewardRound

  const now = dayjs()
  let nextRound = dayjs(campaign.startTime)

  while (nextRound.isBefore(now) && nextRound.isBefore(campaign.endTime)) {
    nextRound = nextRound.add(roundInterval, 'hour')
  }

  if (nextRound.isAfter(campaign.endTime)) {
    nextRound = dayjs(campaign.endTime)
  }

  return {
    id: campaign.uid,
    description: campaign.description,
    tokenAddress: campaign.tokenAddress,
    tokenName: campaign.tokenName,
    ticker: campaign.ticker ?? '',
    marketCap: campaign.marketCap ? Number(campaign.marketCap) : 0,
    totalAmount: campaign.totalAmount ? Number(campaign.totalAmount) : 0,
    remainingAmount: campaign.remainingAmount ? Number(campaign.remainingAmount) : 0,
    startTime: campaign.startTime,
    endTime: campaign.endTime,
    status: campaign.status,
    participationCount: 0,
    tags: campaign.tags,
    claimed: false,
    claimableAmount: 0,
    nextRound: nextRound.toDate(),
    socialLinks: campaign.socialLinks as unknown as ISocialLinks,
    leaderboard: [],
  }
}

function toCampaignDomain(
  campaignRequest: CreateCampaignRequestDto,
  creatorId: number,
): CampaignDomain {
  const startTime = dayjs()
  const endTime = startTime.add(campaignRequest.duration, 'hour')
  return {
    description: campaignRequest.description,
    tokenAddress: campaignRequest.tokenAddress,
    tokenName: campaignRequest.tokenName,
    totalAmount: campaignRequest.totalAmount,
    remainingAmount: campaignRequest.totalAmount,
    marketCap: 0,
    startTime: startTime.toDate(),
    endTime: endTime.toDate(),
    status: CampaignStatus.ONGOING,
    creatorId: creatorId,
    rewardRound: campaignRequest.rewardRound,
    socialLinks: campaignRequest.socialLinks,
  }
}
