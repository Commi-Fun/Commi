import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth_service';
import { JwtStrategy } from '../auth/jwt_strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '../controllers/user_controller';
import { UserModule } from './user_module';
import { WhitelistModule } from './whitelist_module';
import { TwitterService } from '../services/twitter_service';
import { WhitelistController } from '../controllers/whitelist_controller';

@Module({
  imports: [
    UserModule,
    WhitelistModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1 day' },
    }),
  ],
  controllers: [UserController, WhitelistController],
  providers: [AuthService, JwtStrategy, TwitterService],
  exports: [AuthService],
})
export class AuthModule {}
