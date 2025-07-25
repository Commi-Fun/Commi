// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma_service';

@Global() 
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}