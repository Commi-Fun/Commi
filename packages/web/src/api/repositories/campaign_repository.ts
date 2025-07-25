import { Campaign, Prisma } from '../../../../db/generated/prisma/client';
import { PrismaService } from '../../../../db/src/prisma_service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignRepository {
  constructor(private prisma: PrismaService) {}

  async createCampaign(data: Prisma.CampaignCreateInput): Promise<Campaign> {
    return this.prisma.campaign.create({ data });
  }

  async findCampaignById(id: number): Promise<Campaign | null> {
    return this.prisma.campaign.findUnique({ 
      where: { id }
    });
  }

  async findActiveActivities(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateCampaign(
    id: number, 
    data: Prisma.CampaignUpdateInput
  ): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id },
      data
    });
  }

  async deleteCampaign(id: number): Promise<void> {
    await this.prisma.campaign.delete({ where: { id } });
  }

  async listActivities(
    page: number = 1, 
    limit: number = 10,
    filters?: { status?: string, tag?: string }
  ): Promise<Campaign[]> {
    const where: Prisma.CampaignWhereInput = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.tag) {
      where.tags = { has: filters.tag };
    }
    
    return this.prisma.campaign.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }
}