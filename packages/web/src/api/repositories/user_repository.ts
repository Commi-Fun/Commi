import { PrismaService, PrismaTransaction } from '../../../../db/src/prisma_service';
import {User, Wallet, Participation, Prisma} from '../../../../db/generated/prisma/client'
import { Injectable } from '@nestjs/common';
import { UserDomain } from '../models/domain'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: UserDomain, tx?: PrismaTransaction): Promise<User> {
    const client = tx || this.prisma;
    const entity: Prisma.UserCreateInput = {
      twitterId: data.twitterId as string,
      username: data.username as string,
      name: data.name as string,
      profileImageUrl: data.profileImageUrl
    }
    return client.user.create({ data: entity });
  }

  async updateUser(data: UserDomain, tx?: PrismaTransaction): Promise<User> {
    const client = tx || this.prisma;
    return client.user.update({
      where: { id: data.userId },
      data: {
        twitterId: data.twitterId,
        profileImageUrl: data.profileImageUrl,
        name: data.name,
        username: data.username
      }
    });
  }

  async upsertUser(data: UserDomain, tx?: PrismaTransaction): Promise<User> {
    const client = tx || this.prisma;
    return client.user.upsert({ 
      where: {
        twitterId: data.twitterId,
      },
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
      }
     });
  }

  async findUserByTwitterId(twitterId: string, tx?: PrismaTransaction): Promise<User | null> {
    const client = tx || this.prisma;
    return client.user.findUnique({ 
      where: { 
        twitterId: twitterId 
      }
    });
  }

  async addWalletToUser(userId: number, address: string, tx?: PrismaTransaction): Promise<Wallet> {
    const client = tx || this.prisma;
    return client.wallet.create({
      data: {
        address,
        userId
      }
    });
  }

  async setPrimaryWallet(userId: number, walletId: number, tx?: PrismaTransaction): Promise<Wallet> {
    const client = tx || this.prisma;
    return client.wallet.update({
      where: { id: walletId },
      data: { isPrimary: true }
    })
  }

  async getUserParticipations(userId: number, tx?: PrismaTransaction): Promise<Participation[]> {
    const client = tx || this.prisma;
    return client.participation.findMany({
      where: { userId }
    });
  }
}