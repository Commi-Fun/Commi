import { Test, TestingModule } from '@nestjs/testing';
import { CampaignRepository } from '../../packages/web/src/api/repositories/campaign_repository';
import { PrismaService } from '../../packages/db/src/prisma_service';

describe('CampaignRepository', () => {
  let repository: CampaignRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    
    // 清空测试数据
    await prisma.campaign.deleteMany();
    
    repository = new CampaignRepository(prisma);
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should create an campaign', async () => {
    const campaignData = {
      name: 'Test Campaign',
      description: 'This is Test Campaign',
      tokenAddress: '0x123abc',
      tokenName: 'TEST',
      totalAmount: 1000,
      remainingAmount: 500,
      marketCap: 1000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tags: ['nft', 'gamefi'],
      socialLinks: [],
      creatorId: 0
    };
    
    const campaign = await repository.createCampaign(campaignData);
    
    expect(campaign).toBeDefined();
    expect(campaign.name).toBe('Test Campaign');
    expect(campaign.status).toBe('pending');
  });

  it('should find active activities', async () => {
    // 创建测试数据
    await prisma.campaign.createMany({
      data: [
        {
          id: 0,
          name: 'Active Campaign 1',
          tokenAddress: '0x123',
          tokenName: 'ACT1',
          totalAmount: 1000,
          remainingAmount: 500,
          marketCap: 1000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 86400000),
          status: 'active',
          creatorId: 0
        },
        {
          id: 1,
          name: 'Ended Campaign',
          tokenAddress: '0x456',
          tokenName: 'END1',
          totalAmount: 2000,
          remainingAmount: 500,
          marketCap: 2000,
          startTime: new Date(Date.now() - 86400000),
          endTime: new Date(Date.now() - 3600000),
          status: 'ended',
          creatorId: 1
        }
      ]
    });
    
    const activeActivities = await repository.findActiveActivities();
    
    expect(activeActivities.length).toBe(1);
    expect(activeActivities[0].name).toBe('Active Campaign 1');
  });

  it('should list activities with filters', async () => {
    // 创建测试数据
    await prisma.campaign.createMany({
      data: [
        {
          id: 0,
          name: 'NFT Campaign',
          tokenAddress: '0x123',
          tokenName: 'NFT',
          totalAmount: 1000,
          remainingAmount: 500,
          marketCap: 1000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 86400000),
          status: 'active',
          tags: ['nft', 'art'],
          creatorId: 0
        },
        {
          id: 1,
          name: 'GameFi Campaign',
          tokenAddress: '0x456',
          tokenName: 'GAME',
          totalAmount: 2000,
          remainingAmount: 500,
          marketCap: 2000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 86400000),
          status: 'active',
          tags: ['gamefi', 'p2e'],
          creatorId: 1
        }
      ]
    });
    
    // 测试标签过滤
    const nftActivities = await repository.listActivities(1, 10, { tag: 'nft' });
    expect(nftActivities.length).toBe(1);
    expect(nftActivities[0].name).toBe('NFT Campaign');
    
    // 测试状态过滤
    const endedActivities = await repository.listActivities(1, 10, { status: 'ended' });
    expect(endedActivities.length).toBe(0);
  });
});