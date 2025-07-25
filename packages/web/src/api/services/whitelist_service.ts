import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, Whitelist } from '../../../../db/generated/prisma/client';
import { PrismaService } from '../../../../db/src/prisma_service';
import { WhitelistRepository, WhitelistStatus } from '..//repositories/whitelist_repository';
import { ReferralRepository } from '../repositories/referral_repository';
import { UserDTO } from '../models/dto'
import { WhitelistDomain, ReferralDomain } from '../models/domain'

@Injectable()
export class WhitelistService {
  constructor(
    private whiteRepository: WhitelistRepository,
    private referralRepository: ReferralRepository,
    private prismaService: PrismaService,
  ) { }


  async getWhitelist(twitterId: string) {
    const whitelist = await this.whiteRepository.findWhitelistByTwitterId(twitterId);
    if (whitelist != null) {
      const whitelistDomain: WhitelistDomain = {
        user: {
          userId: whitelist.userId,
          twitterId: whitelist.twitterId,
        },
        referralCode: whitelist.referralCode,
        status: whitelist.status
      }
      return whitelistDomain
    }
    return
  }

  async createWhitelist(
    data: UserDTO,
    referralCode?: string
  ) {
    // get referer by referralCode
    let referrer: Whitelist | null
    if (referralCode != undefined && referralCode != null) {
      referrer = await this.whiteRepository.findWhitelistByReferralCode(referralCode);
    }

    const result = await this.prismaService.$transaction(async (prismaTx) => {
      const tx = this.prismaService.getTransactionClient(prismaTx)
      if (referrer !== null) {
        const referralDomain: ReferralDomain = {
          referrerId: referrer.userId,
          referrerTwitterId: referrer.twitterId,
          refereeId: data.userId as number,
          refereeTwitterId: data.twitterId
        };
        const referralResult = await this.referralRepository.createReferral(referralDomain, tx);
        if (!referralResult) {
          throw new InternalServerErrorException();
        }

        const whitelistDomain: WhitelistDomain = {
          user: {
            userId: referrer.userId,
            twitterId: referrer.twitterId,
          },
          status: WhitelistStatus.CAN_CLAIM
        };
        const updateResult = await this.whiteRepository.updateWhitelist(whitelistDomain, tx);
        if (!updateResult) {
          throw new InternalServerErrorException();
        }
      }

      // prepare data
      const whitelistDomain: WhitelistDomain = {
        user: {
          userId: data.userId,
          twitterId: data.twitterId,
        },
        referralCode: referralCode,
        status: WhitelistStatus.REGISTERED
      };

      // execute CREATE
      const whitelistResult = await this.whiteRepository.createWhitelist(whitelistDomain, tx);
      if (!whitelistResult) {
        throw new InternalServerErrorException();
      }
      return whitelistResult
    })
    const resultDomain: WhitelistDomain = {
      user: { userId: result.userId, twitterId: result.twitterId },
      status: result.status
    }
    return resultDomain
  }

  async claimWhitelist(data: UserDTO) {
    const whitelistDomain: WhitelistDomain = {
      user: {
        userId: data.userId,
        twitterId: data.twitterId,
      },
      status: WhitelistStatus.CLAIMED
    };

    // execute UPDATE
    return this.whiteRepository.updateWhitelist(whitelistDomain);
  }
}