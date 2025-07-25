import { prisma } from 'packages/db/src/index';

export async function createCampaign(data: any) {
  return prisma.campaign.create({ data });
}

export async function findCampaignById(id: number) {
  return prisma.campaign.findUnique({ where: { id } });
}

export async function findActiveActivities() {
  return prisma.campaign.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
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