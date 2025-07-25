
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth_service';
import { AuthUser } from '../types/express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: any): Promise<AuthUser> {
    const user = await this.authService.validateUser(
      payload.twitterId,
    );

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return { userId: user.id, twitterId: user.twitterId };
  }

}
