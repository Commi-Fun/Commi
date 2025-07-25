import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../packages/web/src/api/repositories/user_repository';
import { PrismaService } from '../../packages/db/src/prisma_service';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    
    // 清空测试数据
    await prisma.campaign.deleteMany();
    
    repository = new UserRepository(prisma);
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should create an user', async () => {
    const userData = {
        userId: 0,
        twitterId: "TwitterId",
        profileImageUrl: "avatar",
        name: "handle",
        username: "name"
    };
    
    const user = await repository.createUser(userData);
    
    expect(user).toBeDefined();
    expect(user.twitterId).toBe('TwitterId');
  });

  it('should find user by twitterId', async () => {
    // 创建测试数据
    await prisma.user.createMany({
      data: [
        {
            twitterId: "TwitterId0",
            profileImageUrl: "avatar0",
            name: "handle0",
            username: "name0"
        },
        {
            twitterId: "TwitterId1",
            profileImageUrl: "avatar1",
            name: "handle1",
            username: "name1"
        }
      ]
    });
    
    const user = await repository.findUserByTwitterId("TwitterId0");
    expect(user).not.toBeNull();
  });
});