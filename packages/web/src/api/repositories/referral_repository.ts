import { Referral, Prisma } from '../../../../db/generated/prisma/client';
import { PrismaService, PrismaTransaction } from '../../../../db/src/prisma_service';
import { Injectable } from '@nestjs/common';
import { ReferralDomain } from '../models/domain'

@Injectable()
export class ReferralRepository {
  constructor(private prisma: PrismaService) { }

  async createReferral(data: ReferralDomain, tx?: PrismaTransaction): Promise<Referral> {
    const client = tx || this.prisma;
    const entity: Prisma.ReferralCreateInput = {
      referrerId: data.refereeId,
      referrerTwitterId: data.referrerTwitterId,
      refereeId: data.refereeId,
      refereeTwitterId: data.refereeTwitterId,
    }
    return client.referral.create({ data: entity });
  }
}