import { Module } from '@nestjs/common';
import { CampaignRepository } from '../repositories/campaign_repository';
import { TweetRepository } from '../repositories/tweet_repository';
import { UserRepository } from '../repositories/user_repository';
import { PrismaClient } from '../../../../db/generated/prisma/client';
import { AuthModule } from './auth_module';
import { UserModule } from './user_module';

@Module({
  providers: [
    PrismaClient,
    CampaignRepository,
    TweetRepository,
    UserRepository,
  ],
  exports: [
    PrismaClient,
    CampaignRepository,
    TweetRepository,
    UserRepository,
  ],
  imports: [
    UserModule,
    AuthModule
  ],
})
export class AppModule { }