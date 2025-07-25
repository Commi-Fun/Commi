import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'User not found',
            error: 'Unauthorized'
          });
        }
        return user;
      }
}