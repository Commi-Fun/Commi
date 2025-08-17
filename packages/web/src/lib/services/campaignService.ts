import { CampaignDomain } from '@/types/domain';
import { CampaignDto, UserDTO } from '@/types/dto';
import { Campaign, CampaignStatus, Prisma, prisma } from '@commi-dashboard/db';
import { createErrorResult, createSuccessResult, ServiceResult } from '../utils/serviceResult';
import { BadRequestError, NotFoundError } from '../utils/errors';


// Service Function
export async function list(): Promise<ServiceResult<Array<CampaignDto>>>  {
  try {
    const campaigns = await findActiveCampaigns()
    if (!campaigns || campaigns.length === 0) {
      createSuccessResult(null)
    }

    const result = []
    const campaignIds = []
    let participationCountMap: Map<number, number> = new Map()
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      result.push(toCampaignDto(campaign))
      campaignIds.push(campaign.id)
    }

    const counts =  await prisma.$queryRaw<any[]>`SELECT p.campaignId, count(*) as count FROM Participation p WHERE p.campaignId in ${campaignIds} GROUP BY p.campaignId`
    for (let index = 0; index < counts.length; index++) {
      const c = counts[index];
      participationCountMap.set(c.campaignId, c.count)
    }

    for (let i = 0; i < result.length; i++) {
      const campaign = result[i];
      campaign.participationCount = participationCountMap.get(campaign.id) ?? 0
    }
    return createSuccessResult(result)
  }catch(error: any) {
    return createErrorResult(error.message || 'Failed to get campaign')
  }
}

export async function get(user: UserDTO, id: number): Promise<ServiceResult<CampaignDto>>  {
  try {
    const campaign = await findCampaignById(id)
    if (!campaign) {
      throw new NotFoundError("Campaign not found.")
    }

    const campaignDto = toCampaignDto(campaign)

    const creator = await prisma.user.findUnique({
      where: {
        id: campaign.creatorId
      }
    })
    if (creator) {
      campaignDto.creator = creator.name  
    }
    const count = await prisma.participation.count({
      where: {
        campaignId: campaign.id
      }
    })
    campaignDto.participationCount = count
    if (user) {
      const unclaimed = await prisma.claimRecord.count({
        where: {
          userId: user.userId as number,
          campaignId: campaign.id,
          claimed: false
        }
      })
      campaignDto.canClaim = unclaimed > 0
    }
    return createSuccessResult(campaignDto)
  }catch(error: any) {
    return createErrorResult(error.message || 'Failed to get campaign')
  }
}

export async function create(user: UserDTO, data: CampaignDto): Promise<ServiceResult>  {
  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.userId
      }
    })
    if (!dbUser) {
      throw new NotFoundError("User not found.")
    }

    if (data.startTime < new Date() || data.startTime < data.endTime) {
      throw new BadRequestError("Invalid start/end time.")
    }
    if (data.totalAmount < 0) {
      throw new BadRequestError("Invalid token amount.")
    }

    const campaignDomain: CampaignDomain = {
      name: data.name,
      description: data.description,
      tokenAddress: data.tokenAddress,
      tokenName: data.tokenName,
      ticker: data.ticker,
      totalAmount: data.totalAmount,
      remainingAmount: data.totalAmount,
      marketCap: data.marketCap,
      startTime: data.startTime,
      endTime: data.endTime,
      tags: data.tags,
      socialLinks: data.socialLinks,
      creatorId: dbUser.id,
      txHash: data.txHash
    }
    await createCampaign(campaignDomain)
    return createSuccessResult(null)
  }catch(error: any) {
    return createErrorResult(error.message || 'Failed to create campaign')
  }
}

export async function claim(user: UserDTO, campaignId: number, txHash: string): Promise<ServiceResult>  {
  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.userId
      }
    })
    if (!dbUser) {
      throw new NotFoundError("User not found.")
    }

    if (!txHash) {
      throw new BadRequestError("Invalid transaction hash.")
    }

    await prisma.claimRecord.updateMany({
      where: {
        userId: user.userId as number,
        campaignId: campaignId,
        claimed: false
      },
      data: {
        txHash: txHash,
        claimed: true
      }
    })
    return createSuccessResult(null)
  }catch(error: any) {
    return createErrorResult(error.message || 'Failed to create campaign')
  }
}


// Repository Function
export async function createCampaign(data: CampaignDomain) {
  return prisma.campaign.create({
    data: {
      name: data.name,
      description: data.description,
      tokenAddress: data.tokenAddress,
      tokenName: data.tokenName,
      ticker: data.ticker,
      totalAmount: data.totalAmount,
      remainingAmount: data.totalAmount,
      startTime: data.startTime,
      endTime: data.endTime,
      tags: data.tags,
      socialLinks: data.tags,
      status: CampaignStatus.UPCOMING,
      creatorId: data.creatorId,
      txHash: data.txHash
    },
  })
}

export async function findCampaignById(id: number) {
  return prisma.campaign.findUnique({ where: { id } });
}

export async function findActiveCampaigns() {
  return prisma.campaign.findMany({
    where: { status: CampaignStatus.ONGOING },
    orderBy: { startTime: 'asc' },
  });
}

export async function updateCampaign(id: number, data: any) {
  return prisma.campaign.update({
    where: { id },
    data,
  });
}

export async function deleteCampaign(id: number) {
  await prisma.campaign.delete({ where: { id } });
}

function toCampaignDto(entity: Campaign): CampaignDto {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    tokenAddress: entity.tokenAddress,
    tokenName: entity.tokenName,
    ticker: entity.ticker,
    totalAmount: entity.totalAmount,
    remainingAmount: entity.remainingAmount,
    marketCap: entity.marketCap ?? BigInt(0),
    startTime: entity.startTime,
    endTime: entity.endTime,
    tags: entity.tags,
    socialLinks: entity.socialLinks,
    creator: "",
    canClaim: false,
    participationCount: 0,
    txHash: ""
  }
}