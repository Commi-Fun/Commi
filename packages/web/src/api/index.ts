import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app';
import { PrismaService } from '../../../db/src/prisma_service';
import { GlobalExceptionFilter } from './common/exception';
import { GlobalResponseInterceptor } from './common/response_interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  const prismaService = app.get(PrismaService);
  await prismaService.onModuleInit();
  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch(err => {
  console.error('Application bootstrap failed:', err);
  process.exit(1);
});