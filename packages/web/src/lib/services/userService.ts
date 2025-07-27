import { prisma } from '@commi-dashboard/db';
import { UserDTO } from '@/types/dto'
import { UserDomain } from '@/types/domain'

// Repository functions
export async function createUserInDb(data: UserDomain) {
  return prisma.user.create({
    data: {
      twitterId: data.twitterId as string,
      handle: data.handle as string,
      name: data.name as string,
      profileImageUrl: data.profileImageUrl,
    },
  });
}

export async function updateUserInDb(data: UserDomain) {
  return prisma.user.update({
    where: { id: data.userId },
    data: {
      twitterId: data.twitterId,
      profileImageUrl: data.profileImageUrl,
      name: data.name,
      handle: data.handle ,
    },
  });
}

export async function upsertUser(data: UserDomain) {
  return prisma.user.upsert({
    where: { twitterId: data.twitterId },
    update: {
      profileImageUrl: data.profileImageUrl,
      name: data.name,
      handle: data.handle,
    },
    create: {
      twitterId: data.twitterId as string,
      profileImageUrl: data.profileImageUrl,
      name: data.name as string,
      handle: data.handle as string,
    },
  });
}

export async function findUserByTwitterId(twitterId: string) {
  return prisma.user.findUnique({ where: { twitterId } });
}

// Service functions
export async function createUser(user: UserDTO) {
  const userDomain: UserDomain = {
    userId: user.userId,
    twitterId: user.twitterId,
    name: user.name,
    handle: user.handle,
    profileImageUrl: user.profileImageUrl,
  };
  return upsertUser(userDomain);
}

export async function updateUser(user: UserDTO) {
  const userDomain: UserDomain = {} as UserDomain;
  if (user.twitterId) {
    const existingUser = await findUserByTwitterId(user.twitterId);
    if (existingUser && existingUser.id !== user.userId) {
      throw new Error('Twitter ID is already in use');
    }
    userDomain.twitterId = user.twitterId;
  }
  if (user.profileImageUrl) userDomain.profileImageUrl = user.profileImageUrl;
  if (user.name) userDomain.name = user.name;
  if (user.handle) userDomain.handle = user.handle;
  return updateUserInDb(userDomain);
}
