import { prisma } from 'packages/db/src/index';
import { UserDomain } from 'packages/web/src/api/models/domain'

export async function createUser(data: UserDomain) {
  return prisma.user.create({
    data: {
      twitterId: data.twitterId as string,
      username: data.username as string,
      name: data.name as string,
      profileImageUrl: data.profileImageUrl,
    },
  });
}

export async function updateUser(data: UserDomain) {
  return prisma.user.update({
    where: { id: data.userId },
    data: {
      twitterId: data.twitterId,
      profileImageUrl: data.profileImageUrl,
      name: data.name,
      username: data.username,
    },
  });
}

export async function upsertUser(data: UserDomain) {
  return prisma.user.upsert({
    where: { twitterId: data.twitterId },
    update: {
      profileImageUrl: data.profileImageUrl,
      name: data.name,
      username: data.username,
    },
    create: {
      twitterId: data.twitterId as string,
      profileImageUrl: data.profileImageUrl,
      name: data.name as string,
      username: data.username as string,
    },
  });
}

export async function findUserByTwitterId(twitterId: string) {
  return prisma.user.findUnique({ where: { twitterId } });
}