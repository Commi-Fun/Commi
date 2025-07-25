import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user_service';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  async validateUser(twitterId: string): Promise<any> {
    if (twitterId == null || twitterId == undefined) {
      return null;
    }
    const user = await this.userService.getUserByTwitterId(twitterId);
    return user || null;
  }

  async createToken(user: any) {
    const payload = { userId: user.id, twitterId: user.twitterId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
