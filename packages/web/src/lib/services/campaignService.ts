import { CampaignDomain } from '@/types/domain'
import { UserDTO, CreateCampaignRequestDto, CampaignResponseDto } from '@/types/dto'
import { Campaign, CampaignStatus, Prisma, prisma } from '@commi-dashboard/db'
import { createErrorResult, createSuccessResult, ServiceResult } from '../utils/serviceResult'
import { BadRequestError, NotFoundError } from '../utils/errors'
import dayjs from 'dayjs'
// Service Functions
export async function list(): Promise<ServiceResult<Array<CampaignResponseDto>>> {
  try {
    const campaigns = await findActiveCampaigns()
    if (!campaigns || campaigns.length === 0) {
      return createSuccessResult([])
    }

    const result: CampaignResponseDto[] = []
    const campaignIds = campaigns.map(c => c.id)
    const participationCountMap: Map<number, number> = new Map()

    // Get participation counts
    const counts = await prisma.$queryRaw<
      Array<{ campaignId: number; count: bigint }>
    >`SELECT p.campaignId, count(*) as count FROM Participation p WHERE p.campaignId in (${Prisma.join(campaignIds)}) GROUP BY p.campaignId`
    for (const c of counts) {
      participationCountMap.set(c.campaignId, Number(c.count))
    }

    // Get creator names
    const creatorIds = [...new Set(campaigns.map(c => c.creatorId))]
    const creators = await prisma.user.findMany({
      where: { id: { in: creatorIds } },
      select: { id: true, name: true },
    })
    const creatorMap = new Map(creators.map(c => [c.id, c.name]))

    for (const campaign of campaigns) {
      const participationCount = participationCountMap.get(campaign.id) ?? 0
      const creatorName = creatorMap.get(campaign.creatorId) || 'Unknown'

      result.push(toCampaignResponseDto(campaign, participationCount, creatorName, false))
    }

    return createSuccessResult(result)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get campaigns'
    return createErrorResult(errorMessage)
  }
}

export async function get(
  user: UserDTO | null,
  id: number,
): Promise<ServiceResult<CampaignResponseDto>> {
  try {
    const campaign = await findCampaignById(id)
    if (!campaign) {
      throw new NotFoundError('Campaign not found.')
    }

    // Get creator name
    const creator = await prisma.user.findUnique({
      where: { id: campaign.creatorId },
      select: { name: true },
    })
    const creatorName = creator?.name || 'Unknown'

    // Get participation count
    const participationCount = await prisma.participation.count({
      where: { campaignId: campaign.id },
    })

    // Check if user has claimed
    let claimed = false
    if (user?.userId) {
      const unclaimed = await prisma.claimRecord.count({
        where: {
          userId: user.userId,
          campaignId: campaign.id,
          claimed: false,
        },
      })
      claimed = unclaimed === 0
    }

    const responseDto = toCampaignResponseDto(campaign, participationCount, creatorName, claimed)

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
      where: { id: user.userId },
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
    console.log('campaignDomain', campaignDomain)
    const result = await createCampaign(campaignDomain)

    return createSuccessResult({ id: result.id })
  } catch (error: unknown) {
    // console.log('error', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create campaign'
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

// Repository Functions
export async function createCampaign(data: CampaignDomain) {
  return prisma.campaign.create({
    data: {
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
      socialLinks: data.socialLinks,
      status: data.status as CampaignStatus,
      creatorId: data.creatorId,
      txHash: data.txHash,
    },
  })
}

export async function findCampaignById(id: number) {
  return prisma.campaign.findUnique({ where: { id } })
}

export async function findActiveCampaigns() {
  return prisma.campaign.findMany({
    where: { status: CampaignStatus.ONGOING },
    orderBy: { startTime: 'asc' },
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
function toCampaignResponseDto(
  campaign: Campaign,
  participationCount: number,
  creatorName: string,
  claimed: boolean,
): CampaignResponseDto {
  return {
    id: campaign.id,
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
    participationCount: participationCount,
    creator: creatorName,
    tags: campaign.tags,
    claimed: claimed,
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
    socialLinks: campaignRequest.socialLinks,
  }
}
