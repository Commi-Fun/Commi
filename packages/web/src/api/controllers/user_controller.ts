import {
  Controller,
  Body,
  BadRequestException,
  Post,
  UnauthorizedException
} from '@nestjs/common'
import { UserService } from '../services/user_service'
import { AuthService } from '../services/auth_service'
import { TwitterService } from '../services/twitter_service'
import type { LoginDto } from '../models/dto'

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly twitterService: TwitterService,
    private readonly authService: AuthService
  ) { }

  @Post('login')
  async login(
    @Body() data: LoginDto
  ) {
    // validate request data
    if (!data.accessToken) {
      throw new UnauthorizedException('No valid token provided');
    }

    // get twitter user from access token
    const twitterUser = await this.twitterService.me(data.accessToken);
    if (!twitterUser) {
      throw new BadRequestException("Failed to verify Twitter credentials");
    }

    // create/update userInfo
    const userData = {
      twitterId: twitterUser.id,
      avatar: twitterUser.avatar,
      handle: twitterUser.name,
      displayName: twitterUser.screenName
    }
    const user = await this.userService.createUser(userData);

    // generate JWT
    return this.authService.createToken(user);
  }
}