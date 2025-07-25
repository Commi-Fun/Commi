import { Whitelist, Prisma } from '../../../../db/generated/prisma/client';
import { PrismaService, PrismaTransaction } from '../../../../db/src/prisma_service';
import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { WhitelistDomain } from '../models/domain'

export enum WhitelistStatus {
  REGISTERED = "REGISTERED",
  CAN_CLAIM = "CAN_CLAIM",
  CLAIMED = "CLAIMED"
}

@Injectable()
export class WhitelistRepository {
  constructor(private prisma: PrismaService) { }

  async createWhitelist(data: WhitelistDomain, tx?: PrismaTransaction): Promise<Whitelist> {
    const client = tx || this.prisma;
    const entity: Prisma.WhitelistCreateInput = {
      userId: data.user.userId as number,
      twitterId: data.user.twitterId as string,
      referralCode: nanoid(6),
      status: data.status,
    }
    return client.whitelist.create({ data: entity });
  }

  async updateWhitelist(data: WhitelistDomain, tx?: PrismaTransaction): Promise<Whitelist> {
    const client = tx || this.prisma;
    const entity: Prisma.WhitelistUpdateInput = {
      userId: data.user.userId,
      twitterId: data.user.twitterId,
      status: data.status,
    }
    return client.whitelist.update({
      where: {
        twitterId: entity.twitterId as string,
        userId: entity.userId as number
      },
      data: {
        status: entity.status
      }
    });
  }

  async findWhitelistByTwitterId(twitterId: string, tx?: PrismaTransaction): Promise<Whitelist | null> {
    const client = tx || this.prisma;
    return client.whitelist.findUnique({
      where: { twitterId }
    });
  }

  async findWhitelistByReferralCode(code: string, tx?: PrismaTransaction): Promise<Whitelist | null> {
    const client = tx || this.prisma;
    return client.whitelist.findUnique({
      where: { referralCode: code }
    });
  }
}