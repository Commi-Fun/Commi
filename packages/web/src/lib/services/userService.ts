/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@commi-dashboard/db'
import { UserDTO } from '@/types/dto'
import { UserDomain } from '@/types/domain'
import { createErrorResult, createSuccessResult, ServiceResult } from '../utils/serviceResult'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/errors'
import { isValidSignature } from '@commi-dashboard/common'

// Repository functions
export async function createUserInDb(data: UserDomain) {
  return prisma.user.create({
    data: {
      twitterId: data.twitterId as string,
      handle: data.handle as string,
      name: data.name as string,
      profileImageUrl: data.profileImageUrl,
    },
  })
}

export async function updateUserInDb(data: UserDomain) {
  return prisma.user.update({
    where: { id: data.userId },
    data: {
      twitterId: data.twitterId,
      profileImageUrl: data.profileImageUrl,
      name: data.name,
      handle: data.handle,
    },
  })
}

export async function upsertUserInDb(data: UserDomain) {
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
  })
}

export async function findUserByTwitterId(twitterId: string) {
  return prisma.user.findUnique({ where: { twitterId } })
}

// Service functions
export async function createUser(user: UserDTO): Promise<ServiceResult<UserDTO | null>> {
  const userDomain: UserDomain = {
    userId: user.userId,
    twitterId: user.twitterId,
    name: user.name,
    handle: user.handle,
    profileImageUrl: user.profileImageUrl,
  }
  try {
    const user = await upsertUserInDb(userDomain)
    if (user != null) {
      const userDto: UserDTO = {
        twitterId: user.twitterId,
        name: user.name,
        handle: user.handle,
        profileImageUrl: user.profileImageUrl || '',
      }
      return createSuccessResult(userDto)
    }
    return createSuccessResult(null)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to create user')
  }
}

export async function updateUser(user: UserDTO): Promise<ServiceResult<UserDTO | null>> {
  const userDomain: UserDomain = {} as UserDomain
  if (user.twitterId) {
    const existingUser = await findUserByTwitterId(user.twitterId)
    if (existingUser && existingUser.id !== user.userId) {
      throw new UnauthorizedError('Twitter ID is already in use')
    }
    userDomain.twitterId = user.twitterId
  }
  if (user.profileImageUrl) userDomain.profileImageUrl = user.profileImageUrl
  if (user.name) userDomain.name = user.name
  if (user.handle) userDomain.handle = user.handle
  try {
    const result = await updateUserInDb(userDomain)
    if (result != null) {
      const userDto: UserDTO = {
        twitterId: user.twitterId,
        name: user.name,
        handle: user.handle,
        profileImageUrl: user.profileImageUrl || '',
      }
      return createSuccessResult(userDto)
    }
    return createSuccessResult(null)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to update user')
  }
}
export async function userAndAddressConnected(
  userId: number | undefined,
  address: string,
): Promise<boolean> {
  try {
    const count = await prisma.wallet.count({
      where: {
        userId: userId,
        address: address,
      },
    })
    return count > 0
  } catch {
    return false
  }
}

export async function connect(
  user: UserDTO,
  wallet: { address: string; signature: string },
): Promise<ServiceResult<UserDTO | null>> {
  try {
    // todo: check signature
    if (!isValidSignature(wallet.address, wallet.signature)) {
      throw new ForbiddenError('Invalid signature.')
    }

    const u = await prisma.user.findUnique({
      where: {
        twitterId: user.twitterId,
      },
    })
    if (!u) {
      throw new NotFoundError('User not found.')
    }
    const isAlreadyConnected = await userAndAddressConnected(user.userId, wallet.address)

    if (isAlreadyConnected) {
      throw new BadRequestError('Wallet already binded.')
    }

    const bindedWallet = await prisma.wallet.findFirst({
      where: {
        address: wallet.address,
      },
    })

    if (bindedWallet && bindedWallet.userId !== user.userId) {
      throw new BadRequestError('Wallet already binded to another user.')
    }

    const wallets = await prisma.wallet.findMany({
      where: {
        userId: user.userId as number,
      },
    })
    await prisma.wallet.create({
      data: {
        address: wallet.address,
        isPrimary: !wallets || wallets.length === 0,
        userId: user.userId as number,
      },
    })

    return createSuccessResult(null)
  } catch (error: any) {
    return createErrorResult(error.message || 'Failed to connect wallet')
  }
}
