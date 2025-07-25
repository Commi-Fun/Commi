import { Module } from '@nestjs/common';
import { WhitelistService } from '../services/whitelist_service';
import { WhitelistRepository } from '../repositories/whitelist_repository';
import { PrismaModule } from '../../../../db/src/prisma_module';
import { ReferralRepository } from '../repositories/referral_repository';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [WhitelistService, WhitelistRepository, ReferralRepository],
  exports: [WhitelistService, WhitelistRepository, ReferralRepository],
})
export class WhitelistModule { }
