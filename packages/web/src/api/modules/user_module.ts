import { Module } from '@nestjs/common';
import { UserService } from '../services/user_service';
import { UserRepository } from '../repositories/user_repository';
import { PrismaModule } from '../../../../db/src/prisma_module';

@Module({
    imports: [
        PrismaModule,
    ],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
